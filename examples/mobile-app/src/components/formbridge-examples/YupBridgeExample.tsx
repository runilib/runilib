// import { useMemo, useState } from 'react';
// import { Text, View } from 'react-native';

// import { field, useFormBridge, yupBridge } from '@runilib/react-formbridge';

// import * as yup from 'yup';
// import { formExampleStyles as s } from './FormExamples.styles';
// import { BridgeExampleCard } from './BridgeExampleCard';
// import { simulateSubmitDelay } from './shared';

// export function YupBridgeExample() {
//   const [lastSubmission, setLastSubmission] = useState<unknown>(null);
//   const formSchema = useMemo(
//     () => ({
//       companyName: field.text().label('Company name').placeholder('Runilib Studio'),
//       website: field.url().label('Website').placeholder('https://runilib.dev'),
//       monthlyBudget: field.text().label('Monthly budget').placeholder('2500'),
//       acceptsPilot: field
//         .checkbox()
//         .label('Approve pilot terms')
//         .hint('Required before the pilot request can move forward.'),
//     }),
//     [],
//   );

//   const schema = useMemo(
//     () =>
//       yup.object({
//         companyName: yup
//           .string()
//           .trim()
//           .min(2, 'Add a company name.')
//           .required('Required'),
//         website: yup.string().trim().url('Use a full https:// URL.').required('Required'),
//         monthlyBudget: yup
//           .number()
//           .transform((value, originalValue) => {
//             return String(originalValue).trim() === '' ? undefined : value;
//           })
//           .typeError('Use a numeric monthly budget.')
//           .min(500, 'Budget should start at 500.')
//           .required('Required'),
//         acceptsPilot: yup.boolean().oneOf([true], 'You need to approve the pilot terms.'),
//       }),
//     [],
//   );

//   const bridge = useMemo(() => yupBridge(schema, { mode: 'sync' }), [schema]);

//   const form = useFormBridge(formSchema, {
//     validateOn: 'onBlur',
//     revalidateOn: 'onChange',
//     validatorBridge:resolver,
//   });

//   const { Form, fieldController, state, watchAll } = form;

//   const liveValues = watchAll();

//   return (
//     <BridgeExampleCard
//       bridgeName="Yup"
//       accent="#34d399"
//       title="Pilot qualification form"
//       description="Readable chained rules with casting for common business flows."
//       highlights={['Chainable API', 'Number casting', 'Boolean constraints']}
//       preview={
//         <>
//           <Text style={s.previewValue}>{liveValues.companyName || 'Pilot company'}</Text>
//           <Text style={s.previewText}>
//             Yup casts the budget into a number and blocks submit until the opt-in flag is
//             accepted.
//           </Text>
//         </>
//       }
//       parsedSubmission={lastSubmission}
//       submittedLabel={
//         lastSubmission
//           ? `Pilot request queued for ${String(liveValues.companyName || 'company')}`
//           : null
//       }
//       submitError={state.submitError}
//       footer="Yup is comfortable when your team already models validation with chained declarative rules."
//     >
//       <Form
//         onSubmit={async (values) => {
//           await simulateSubmitDelay();
//           setLastSubmission(values);
//         }}
//       >
//         <View style={s.sectionBlock}>
//           <Text style={s.sectionBlockTitle}>Pilot intake</Text>

//           <View style={s.formRow}>
//             <View style={s.halfField}>
//               <NativeField controller={fieldController('companyName')} />
//             </View>
//             <View style={s.halfField}>
//               <NativeField controller={fieldController('website')} />
//             </View>
//           </View>

//           <NativeField controller={fieldController('monthlyBudget')} />
//           <NativeField controller={fieldController('acceptsPilot')} />
//         </View>
