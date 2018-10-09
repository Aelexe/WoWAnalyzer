// Heavily inspired by resource breakdown in Feral and Retribution
import React from 'react';

import Analyzer from 'parser/core/Analyzer';
import Tab from 'interface/others/Tab';
import StatisticBox, { STATISTIC_ORDER } from 'interface/others/StatisticBox';

import ResourceBreakdown from 'parser/shared/modules/resourcetracker/ResourceBreakdown';
import ChiTracker from './ChiTracker';

import WastedChiIcon from '../../images/ability_monk_forcesphere.jpg';

class ChiDetails extends Analyzer {
  static dependencies = {
    chiTracker: ChiTracker,
  };

  get suggestionThresholds() {
    const chiWastedPerMinute = (this.chiTracker.wasted / this.owner.fightDuration) * 1000 * 60;
    return {
      actual: chiWastedPerMinute,
      isGreaterThan: {
        minor: 0,
        average: 1,
        major: 2,
      },
      style: 'decimal',
    };
  }

  suggestions(when) {
    const chiWasted = this.chiTracker.wasted;
    const chiWastedPerMinute = (chiWasted / this.owner.fightDuration) * 1000 * 60;
    when(this.suggestionThresholds).addSuggestion((suggest, actual, recommended) => {
      return suggest('You are wasting Chi. Try to use it and not let it cap and go to waste')
        .icon('creatureportrait_bubble')
        .actual(`${chiWasted} Chi wasted (${chiWastedPerMinute.toFixed(2)} per minute)`)
        .recommended(`${recommended.toFixed(2)} Chi wasted is recommended`);
    });
  }

  statistic() {
    const chiWasted = this.chiTracker.wasted;
    return (
      <StatisticBox
        position={STATISTIC_ORDER.CORE(1)}
        icon={(
          <img
            src={WastedChiIcon}
            alt="Wasted Chi"
          />
        )}
        value={`${chiWasted}`}
        label="Wasted Chi"
      />
    );
  }

  tab() {
    return {
      title: 'Chi',
      url: 'chi',
      render: () => (
        <Tab>
          <ResourceBreakdown
            tracker={this.chiTracker}
            resourceName="Chi"
            showSpenders
          />
        </Tab>
      ),
    };
  }
}

export default ChiDetails;
