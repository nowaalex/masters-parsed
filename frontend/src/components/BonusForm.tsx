import { memo } from "react";
import type { ComponentPropsWithoutRef } from "react";

const BonusForm = (props: ComponentPropsWithoutRef<"form">) => (
  <form {...props}>
    <label className="grid">
      Set bonus
      <input
        required
        name="setBonus"
        defaultValue="0"
        type="number"
        min="0"
        max="10000"
      />
    </label>
    <label className="grid">
      First bonus
      <input
        required
        name="firstBonus"
        defaultValue="0"
        type="number"
        min="0"
        max="10000"
      />
    </label>
    <label className="grid">
      Second bonus
      <input
        required
        name="secondBonus"
        defaultValue="0"
        type="number"
        min="0"
        max="10000"
      />
    </label>
  </form>
);

export default memo(BonusForm);
