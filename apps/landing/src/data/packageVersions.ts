import formbridgePackageJson from '../../../../packages/react-formbridge/package.json';
import walkitPackageJson from '../../../../packages/react-walkit/package.json';

export const landingPackageVersions = {
  formbridge: formbridgePackageJson.version,
  walkit: walkitPackageJson.version,
} as const;
