import type { LibraryDoc } from '../../types';
import { actionsSection } from './sections/actions';
import { adaptersSection } from './sections/adapters';
import { analyticsSection } from './sections/analytics';
import { builderBasicsSection } from './sections/builderBasics';
import { checkboxSection } from './sections/checkbox';
import { conditionalSection } from './sections/conditional';
import { customSection } from './sections/custom';
import { dateSection } from './sections/date';
import { dynamicSection } from './sections/dynamic';
import { emailSection } from './sections/email';
import { fieldControllerSection } from './sections/fieldController';
import { fieldsSection } from './sections/fields';
import { fileSection } from './sections/file';
import { formSection } from './sections/form';
import { inferSection } from './sections/infer';
import { inferTypeSection } from './sections/inferType';
import { installSection } from './sections/install';
import { maskedSection } from './sections/masked';
import { numberSection } from './sections/number';
import { otpSection } from './sections/otp';
import { overviewSection } from './sections/overview';
import { passwordSection } from './sections/password';
import { persistenceSection } from './sections/persistence';
import { phoneSection } from './sections/phone';
import { quickstartSection } from './sections/quickstart';
import { radioSection } from './sections/radio';
import { readonlySection } from './sections/readonly';
import { schemaSection } from './sections/schema';
import { selectSection } from './sections/select';
import { stateSection } from './sections/state';
import { switchSection } from './sections/switch';
import { telSection } from './sections/tel';
import { textSection } from './sections/text';
import { textareaSection } from './sections/textarea';
import { tutorialSection } from './sections/tutorial';
import { tutorialCheckoutSection } from './sections/tutorialCheckout';
import { tutorialCustomUiSection } from './sections/tutorialCustomUi';
import { tutorialProductionSection } from './sections/tutorialProduction';
import { tutorialSignupSection } from './sections/tutorialSignup';
import { tutorialValidationSection } from './sections/tutorialValidation';
import { urlSection } from './sections/url';
import { useAsyncOptionsSection } from './sections/useAsyncOptions';
import { useFormBridgeSection } from './sections/useFormBridge';
import { useFormBridgeContextSection } from './sections/useFormBridgeContext';
import { validationSection } from './sections/validation';
import { webUiSection } from './sections/webUi';
import { wizardSection } from './sections/wizard';
import { docSidebar } from './sidebar';

export const formbridgeDocs: LibraryDoc = {
  libId: 'formbridge',
  versions: ['1.0.0'],
  sidebar: docSidebar,
  sections: [
    overviewSection,
    installSection,
    quickstartSection,
    schemaSection,
    tutorialSection,
    tutorialSignupSection,
    tutorialCheckoutSection,
    tutorialValidationSection,
    tutorialCustomUiSection,
    tutorialProductionSection,
    useFormBridgeSection,
    formSection,
    fieldsSection,
    fieldControllerSection,
    stateSection,
    actionsSection,
    validationSection,
    builderBasicsSection,
    textSection,
    emailSection,
    passwordSection,
    telSection,
    urlSection,
    textareaSection,
    numberSection,
    checkboxSection,
    switchSection,
    selectSection,
    radioSection,
    dateSection,
    phoneSection,
    maskedSection,
    fileSection,
    otpSection,
    customSection,
    inferSection,
    inferTypeSection,
    adaptersSection,
    conditionalSection,
    persistenceSection,
    webUiSection,
    useFormBridgeContextSection,
    analyticsSection,
    useAsyncOptionsSection,
    dynamicSection,
    wizardSection,
    readonlySection,
  ],
};
