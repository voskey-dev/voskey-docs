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
				label: '初めての方へ',
				slug: 'for-beginner'
			},
			{
				label: '利用規約・プライバシーポリシー',
				items: [
					{ label: '利用規約', slug: 'terms/term' },
					{ label: 'プライバシーポリシー', slug: 'terms/privacy-policy' },
				],
			},
			{
				label: 'ルール全般',
				items: [
					{ label: '基本ルール', slug: 'core-rules' },
					{ label: '個別詳細ルール', slug: 'specific-rules' },
					{
						label: 'ユーザー機能',
						autogenerate: { directory: 'user-features' },
						collapsed: true
					},
					{
						label: 'コミュニティ運営',
						autogenerate: { directory: 'community' },
						collapsed: true
					},
				],
			},
			{
				label: '絵文字申請ガイド',
				slug: 'emoji-guide',
			},
			{
				label: '特殊なケース',
				autogenerate: { directory: 'special' },
				collapsed: true
			},
		],
	}), tailwind({
		applyBaseStyles: false,
	})],
});
