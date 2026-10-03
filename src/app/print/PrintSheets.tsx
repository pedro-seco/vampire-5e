import { MechanicsSheet } from './MechanicsSheet';
import { NarrativeSheet } from './NarrativeSheet';
import { RefSheet } from './RefSheet';
import './print.css';

export function PrintSheets() {
  return (
    <div className="print-sheets">
      <MechanicsSheet />
      <NarrativeSheet />
      <RefSheet />
    </div>
  );
}
