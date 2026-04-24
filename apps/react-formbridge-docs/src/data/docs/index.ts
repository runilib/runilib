import type { LibraryDoc } from '../../types';
import { formbridgePackageVersion } from '../packageVersion';
import { actionsSection } from './sections/actions';
import { analyticsSection } from './sections/analytics';
import { baseFieldBuilderSection } from './sections/baseFieldBuilder';
import { builderBasicsSection } from './sections/builderBasics';
import { checkboxSection } from './sections/checkbox';
import { conditionalSection } from './sections/conditional';
import { customSection } from './sections/custom';
import { dateSection } from './sections/date';
import { dynamicSection } from './sections/dynamic';
import { emailSection } from './sections/email';
import { fieldControllerSection } from './sections/fieldController';
import { fieldErrorSection } from './sections/fieldError';
import { fieldLabelSection } from './sections/fieldLabel';
import { fieldsSection } from './sections/fields';
import { fileSection } from './sections/file';
import { formSection } from './sections/form';
import { globalDefaultsSection } from './sections/globalDefaults';
import { hostHelpersSection } from './sections/hostHelpers';
import { inferSection } from './sections/infer';
import { inferTypeSection } from './sections/inferType';
import { installSection } from './sections/install';
import { introductionSection } from './sections/introduction';
import { maskedSection } from './sections/masked';
import { numberSection } from './sections/number';
import { otpSection } from './sections/otp';
import { passwordSection } from './sections/password';
import { persistenceSection } from './sections/persistence';
import { phoneSection } from './sections/phone';
import { quickstartSection } from './sections/quickstart';
import { radioSection } from './sections/radio';
import { readonlySection } from './sections/readonly';
import { schemaApiSection } from './sections/schema';
import { schemaMentalModelSection } from './sections/schemaMentalModel';
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
import { tutorialSchemaValidationSection } from './sections/tutorialSchemaValidation';
import { tutorialSignupSection } from './sections/tutorialSignup';
import { tutorialValidationSection } from './sections/tutorialValidation';
import { urlSection } from './sections/url';
import { useAsyncOptionsSection } from './sections/useAsyncOptions';
import { useFormBridgeSection } from './sections/useFormBridge';
import { useFormBridgeContextSection } from './sections/useFormBridgeContext';
import { validationSection } from './sections/validation';
import { adaptersSection } from './sections/validatoResolver';
import { webUiSection } from './sections/webUi';
import { wizardSection } from './sections/wizard';
import { docSidebar } from './sidebar';

export const formbridgeDocs: LibraryDoc = {
  libId: 'formbridge',
  versions: [formbridgePackageVersion],
  sidebar: docSidebar,
  sections: [
    introductionSection,
    installSection,
    quickstartSection,
    schemaMentalModelSection,
    tutorialSection,
    tutorialSignupSection,
    tutorialCheckoutSection,
    tutorialValidationSection,
    tutorialSchemaValidationSection,
    tutorialCustomUiSection,
    tutorialProductionSection,
    useFormBridgeSection,
    schemaApiSection,
    formSection,
    fieldErrorSection,
    fieldLabelSection,
    fieldsSection,
    fieldControllerSection,
    hostHelpersSection,
    stateSection,
    actionsSection,
    validationSection,
    globalDefaultsSection,
    builderBasicsSection,
    baseFieldBuilderSection,
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
