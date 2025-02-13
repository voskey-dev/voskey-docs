// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
	site: 'https://voskeydocs.icalo.net',
	integrations: [starlight({
		favicon: '/favicon.png',
		title: 'Voskey Docs',
		defaultLocale: 'root',
		locales: {
			root: {
				label: '日本語',
				lang: 'ja-JP',
			}
		},
		customCss: [
			'./src/tailwind.css'
		],
		// social: {
		//     github: 'https://github.com/withastro/starlight',
		// },
		sidebar: [
			{
				label: 'ランディングページ',
				slug: 'landing'
			},
			{
				label: '利用規約・プライバシーポリシー',
				items: [
					{ label: '利用規約', slug: 'terms/term' },
					{ label: 'プライバシーポリシー', slug: 'terms/privacy-policy' },
				],
			},
			{
				label: '個別ルール',
				items: [
					{ label: '重要', autogenerate: { directory: 'rules/important' } },
					{ label: 'その他', autogenerate: { directory: 'rules/other' }, collapsed: true },
				],
			},
			{
				label: '絵文字申請ルール',
				autogenerate: { directory: 'emoji' },
				collapsed: true
			},
			{
				label: 'ぼすきー内で特殊な事をしたい時に見るやつ',
				autogenerate: { directory: 'special' },
				collapsed: true
			},
			{
				label: 'その他のルール',
				autogenerate: { directory: 'other' },
				collapsed: true
			},
		],
	}), tailwind({
		applyBaseStyles: false,
	})],
});