import nimboPackageJson from '../../../../packages/nimbo/package.json';
import formbridgePackageJson from '../../../../packages/react-formbridge/package.json';
import walkitPackageJson from '../../../../packages/react-walkit/package.json';

export const landingPackageVersions = {
  formbridge: formbridgePackageJson.version,
  walkit: walkitPackageJson.version,
  nimbo: nimboPackageJson.version,
} as const;
