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
import { fileSection } from './sections/file';
import { formSection } from './sections/form';
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
import { tutorialCustomUiSection } from './sections/tutorialCustomUi';
import { urlSection } from './sections/url';
import { useAsyncOptionsSection } from './sections/useAsyncOptions';
import { useFormBridgeSection } from './sections/useFormBridge';
import { useFormBridgeContextSection } from './sections/useFormBridgeContext';
import { validationSection } from './sections/validation';
import { adaptersSection } from './sections/validatorBridge';
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
    tutorialCustomUiSection,
    useFormBridgeSection,
    schemaApiSection,
    formSection,
    fieldErrorSection,
    fieldLabelSection,
    fieldControllerSection,
    stateSection,
    actionsSection,
    validationSection,
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
    useFormBridgeContextSection,
    analyticsSection,
    useAsyncOptionsSection,
    dynamicSection,
    wizardSection,
    readonlySection,
  ],
};
