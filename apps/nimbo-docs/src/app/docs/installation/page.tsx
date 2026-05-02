import { CodeBlock } from '@/components/CodeBlock';
import { Pager } from '@/components/Pager';

export const metadata = { title: 'Installation' };

const HREF = '/docs/installation';

export default function InstallationPage() {
  return (
    <div className="content">
      <h1>Installation</h1>
      <p>Add Nimbo to your project with your package manager of choice.</p>

      <CodeBlock
        filename="terminal"
        language="bash"
      >
        {`npm install @runilib/nimbo
# or
yarn add @runilib/nimbo
# or
pnpm add @runilib/nimbo`}
      </CodeBlock>

      <h2>Requirements</h2>
      <ul>
        <li>React 17 or higher</li>
        <li>Node.js 18 or higher</li>
        <li>React Native 0.73+ (optional)</li>
      </ul>

      <h2>TypeScript</h2>
      <p>
        Nimbo is written in TypeScript and ships its own type definitions. State, actions, and
        selectors are inferred from your store definition, no manual generics required.
      </p>

      <Pager href={HREF} />
    </div>
  );
}
