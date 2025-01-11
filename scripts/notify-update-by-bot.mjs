import { exec } from 'node:child_process';
import { env as _env, exit } from 'node:process';
import { readFile } from 'node:fs/promises';
import { api } from 'misskey-js';

const docsDir = 'src/content/docs';

const envValidators = {
  OLDER: (v) => notEmpty(v),
  NEWER: (v) => notEmpty(v),
  BOT_TOKEN: (v) => notEmpty(v),
  SERVER_URL: (v) => isURL(v),
  PAGES_URL: (v) => isURL(v),
  GITHUB_REPOSITORY: (v) => notEmpty(v),
};


function notEmpty(str) {
  return (typeof str === 'string')
    && (str.trim() !== '');
}
function isURL(str) {
  try {
    new URL(str);
  } catch(e) {
    if (e.name === 'TypeError') return false;
    throw e;
  }
  return true;
}

const env = {};
for (const envname of Object.keys(envValidators)) {
  const value = _env[envname];
  if (envValidators[envname](value)) {
    env[envname] = value;
  } else {
    throw new Error(`Envs validation failed: ${envname} is ${value}`);
  }
}

const diffs = await new Promise(
  resolve => exec(
    `git diff --name-status ${env.OLDER} ${env.NEWER} -- ${docsDir}`,
    (error, stdout, stderr) => {
      // このコマンドが正常終了すればstderrの出力があることはないはず…
      if (error || stderr) throw error || stderr;
      resolve(
        stdout.split('\n').filter(
          diffline => diffline !== ''
        )
      );
    },
  ),
);

if (diffs.length === 0) {
  console.log('no diffs detected.');
  exit();
}

const diffDescriptions = await Promise.all(diffs.map(
  async (diffline) => {
    const stateDescriptions = {
      M: '更新',
      A: '新規',
      D: '削除',
    };
    const regexp = new RegExp([
      // M, A, Dのいずれか一文字
      `^(?<state>[${
        Object.keys(stateDescriptions).join('')
      }])`,
      // 空白
      '\\s*',
      // ファイルパス（相対）
      // 正規表現にファイルパスをねじ込むとパス次第でエスケープがややこしいので後でsliceかreplaceで処理
      '(?<path>\\S.*)(?<ext>\\.\\w+)$',
    ].join(''));

    const matchResult = diffline.match(regexp);
    if (matchResult == null) throw new Error('Unexpected output of git diff: ' + diffs);
    const { state, path, ext }  = matchResult.groups;
    if (!path.startsWith(docsDir)) throw new Error('Unexpected output of git diff: ' + diffs);
    const pageURL = env.PAGES_URL.replace(/\/$/, '')
      + path.slice(docsDir.length);

    const fileText = await readFile(path + ext, { encoding: 'utf8' });
    const title = fileText.match(/^title:\s*(.+)$/m)?.[1]
      ?? '<ページタイトルの読み取りに失敗>';

    return `${stateDescriptions[state]}: ?[${title}](${pageURL})`;
  },
));

const client = new api.APIClient({
  origin: env.SERVER_URL.replace(/\/$/, ''),
  credential: env.BOT_TOKEN,
});

const text = `
Voskey Docsが更新されました！
[詳しい変更内容はこちら](https://github.com/${env.GITHUB_REPOSITORY}/compare/${env.OLDER}...${env.NEWER})

${diffDescriptions.join('\n')}
`.trim();

await client.request('notes/create', { text });
