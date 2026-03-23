import type { LibraryDoc } from "../../types";
import { formbridgeDocs } from "./formbridge";
import { reactWalkitDocs } from "./react-walkit";
import { tooltipDocs } from "./tooltip";

export const DOCS: Record<string, LibraryDoc> = {
  formbridge: formbridgeDocs,
  stepwise: reactWalkitDocs,
  tooltip: tooltipDocs,
};

export { formbridgeDocs, reactWalkitDocs, tooltipDocs };
