import type { LibraryDoc } from './../../../types/index';

export const installSection: LibraryDoc['sections'][number] = {
  id: 'fb-install',
  title: 'Installation',
  content: `Install the scoped package, then let the package exports map resolve the web or native entrypoint automatically.

- Web peers: \`react\` and \`react-dom\`
- Native peers: \`react-native\`
- In React Native TypeScript projects, add \`"customConditions": ["react-native"]\` so the IDE picks the native type surface
- Some field renderers can rely on extra ecosystem packages in your app, such as phone or file-picker helpers, but the form API itself stays the same.`,
  code: {
    filename: 'terminal',
    lang: 'bash',
    code: `npm install @runilib/react-formbridge
# or
yarn add @runilib/react-formbridge
# or
pnpm add @runilib/react-formbridge
`,
  },
  subsections: [
    {
      id: 'fb-install-native-ts',
      title: 'React Native TypeScript note',
      content: `If your editor still shows web-only props in a React Native app, make sure TypeScript resolves the \`react-native\` export condition.

\`\`\`json
{
  "compilerOptions": {
    "customConditions": ["react-native"]
  }
}
\`\`\``,
    },
  ],
};
