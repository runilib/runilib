import { Link } from 'react-router-dom';
import { BrutTestExample } from '../components/form-examples/BrutTest';
import { CustomerCheckoutExample } from '../components/form-examples/CustomerCheckoutExample';
import { CustomMaskExamplesShowcase } from '../components/form-examples/CustomMaskExamplesShowcase';
import { CustomStorageAdapterExample } from '../components/form-examples/CustomStorageAdapterExample';
import { FieldVariantsShowcase } from '../components/form-examples/FieldVariantsShowcase';
import { PasswordVariantsExample } from '../components/form-examples/PasswordVariantsExample';
import { PhoneVariantsExample } from '../components/form-examples/PhoneVariantsExample';
import { ResolverExamplesShowcase } from '../components/form-examples/ResolverExamplesShowcase';
import { StylingExamplesShowcase } from '../components/form-examples/StylingExamplesShowcase';
import { DemoAsyncCityForm } from './DemoAsyncCityForm';

export const FormbridgeExamplesPage = ({
  onOpenWizard,
}: {
  onOpenWizard: () => void;
}) => {
  return (
    <main className="library-shell library-shell-formbridge">
      <section className="library-page-hero fade-up">
        <div className="library-page-topbar">
          <Link
            to="/"
            className="btn btn-ghost"
          >
            ← Library hub
          </Link>
          <Link
            to="/walkit"
            className="btn btn-ghost"
          >
            Explore walkit
          </Link>
        </div>

        <span className="library-eyebrow">Formbridge examples</span>
        <h1>Build forms you will actually enjoy shipping.</h1>
        <p>
          Every `react-formbridge` demo lives here now, from route-based wizards and
          production-style checkout flows to masks, styling overrides, resolvers, and
          async option loading.
        </p>
        <div className="library-form-love-panel">
          <div className="library-form-love-copy">
            <span className="library-form-love-label">Why teams lean into it</span>
            <h2>Less form plumbing. More product momentum.</h2>
            <p>
              The promise is simple: form work should feel fast, expressive, and
              satisfying to build, not like a pile of repetitive edge cases.
            </p>
          </div>

          <div className="library-form-love-points">
            <span>Schema-first field builders</span>
            <span>Polished defaults with easy overrides</span>
            <span>Masks, async options, and resolvers built in</span>
            <span>One mental model for web and native</span>
          </div>
        </div>

        <div className="library-hero-actions">
          <button
            type="button"
            className="btn btn-primary"
            onClick={onOpenWizard}
          >
            Open route-based wizard
          </button>
          <a
            href="#formbridge-showcases"
            className="btn btn-ghost"
          >
            Jump to showcases
          </a>
        </div>
      </section>

      <section className="library-showcase-grid fade-up">
        <article className="library-highlight-card">
          <p className="library-highlight-label">Why this split matters</p>
          <h2>Formbridge is now isolated from the walkit dashboard demos.</h2>
          <p>
            Someone landing on the example app can open a library directly and immediately
            see only the examples that belong to that package.
          </p>
        </article>

        <article className="library-highlight-card">
          <p className="library-highlight-label">Included here</p>
          <ul className="library-example-list">
            <li>Route-based wizard with persisted progress</li>
            <li>Checkout flow and generated field variants</li>
            <li>Password UX recipes for signup, admin, and recovery flows</li>
            <li>Phone picker recipes for support, sales, and directory flows</li>
            <li>File upload recipes for previews, bundles, and imports</li>
            <li>Mask demos for adaptive inputs, license plates, and badges</li>
            <li>Styling patterns and resolver integrations</li>
            <li>Async remote option loading</li>
          </ul>
        </article>
      </section>

      <section
        id="formbridge-showcases"
        className="library-form-layout"
      >
        <div className="library-section-card fade-up">
          <div className="library-section-header">
            <span className="tag tag-blue">High level flows</span>
            <h2>Start with the most representative examples.</h2>
            <p>
              These are the demos most people look for first: a realistic checkout flow, a
              route-based wizard, and an async select driven by remote data.
            </p>
          </div>

          <div className="library-mini-card">
            <div className="library-mini-card-copy">
              <h3>Route-based wizard</h3>
              <p>
                A multi-step onboarding flow that persists state and restores the active
                step from the URL.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary"
              onClick={onOpenWizard}
            >
              Open wizard
            </button>
          </div>

          <CustomerCheckoutExample />

          <CustomStorageAdapterExample />

          <div className="library-mini-card">
            <div className="library-mini-card-copy">
              <h3>Async city field</h3>
              <p>
                Remote options with dependent fields, debounced search, and progressive
                loading.
              </p>
            </div>
            <DemoAsyncCityForm />
          </div>
        </div>

        <div className="library-section-card fade-up">
          <div className="library-section-header">
            <span className="tag tag-blue">Generated field patterns</span>
            <h2>
              Passwords, phone flows, field variants, uploads, masks, styling, and
              resolvers.
            </h2>
            <p>
              The rest of the page is organized by concern so you can compare patterns
              without bouncing between unrelated walkit screens.
            </p>
          </div>

          <BrutTestExample />
          <PasswordVariantsExample />
          <PhoneVariantsExample />
          <FieldVariantsShowcase />
          <CustomMaskExamplesShowcase />
          <StylingExamplesShowcase />
          <ResolverExamplesShowcase />
          {/* <SignupForm /> */}
        </div>
      </section>
    </main>
  );
};
