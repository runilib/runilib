import type { LibraryDoc } from '../../types';
import { formbridgeDocs } from './formbridge';
import { reactWalkitDocs } from './react-walkit';

export const DOCS: Record<string, LibraryDoc> = {
  formbridge: formbridgeDocs,
  walkit: reactWalkitDocs,
};

