import React from 'react';
import Analyzer from 'parser/core/Analyzer';
import SPELLS from 'common/SPELLS/index';
import SpellIcon from 'common/SpellIcon';
import TalentStatisticBox from 'interface/others/TalentStatisticBox';
import STATISTIC_ORDER from 'interface/others/STATISTIC_ORDER';
import { formatNumber, formatPercentage } from 'common/format';

//WCL: https://www.warcraftlogs.com/reports/7DNACRhnaKzBfHLM/#fight=1&source=19
class FeastOfSouls extends Analyzer {

  heal = 0;
  overHeal = 0;

  constructor(...args) {
    super(...args);
    this.active = this.selectedCombatant.hasTalent(SPELLS.FEAST_OF_SOULS_TALENT.id);
  }

  on_byPlayer_heal(event) {
    const spellID = event.ability.guid;
    if (spellID !== SPELLS.FEAST_OF_SOULS_HEAL.id) {
      return;
    }
    this.heal += event.amount;
    this.overHeal += event.overheal || 0;
  }

  statistic() {
    const overHealPercent = this.overHeal/(this.overHeal + this.heal);
    return (
      <TalentStatisticBox
        position={STATISTIC_ORDER.CORE(8)}
        icon={<SpellIcon id={SPELLS.FEAST_OF_SOULS_TALENT.id} />}
        value={`${this.owner.formatItemHealingDone(this.heal)}`}
        label="Feast of Souls"
        tooltip={`This shows the extra hps that the talent provides.<br/>
                  <b>Effective healing:</b> ${formatNumber(this.heal)}<br/>
                  <b>Overhealing:</b> ${formatNumber(this.overHeal)} | ${formatPercentage(overHealPercent)}%`}
      />
    );
  }
}

export default FeastOfSouls;
