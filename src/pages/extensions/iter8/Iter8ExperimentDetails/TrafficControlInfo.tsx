import * as React from 'react';
import { TrafficControl } from '../../../../types/Iter8';
import { Table, TableBody, TableHeader, TableVariant, compoundExpand, IRow } from '@patternfly/react-table';
import { EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import equal from 'fast-deep-equal';
import CodeBranchIcon from '@patternfly/react-icons/dist/js/icons/code-branch-icon';

interface TrafficControlInfoProps {
  trafficControl: TrafficControl;
}

type State = {
  matchRuleExpanded: string[];
  columns: any;
  childColumns: any;
  rows: any;
  isUpdated: boolean;
};

class TrafficControlInfo extends React.Component<TrafficControlInfoProps, State> {
  constructor(props: TrafficControlInfoProps) {
    super(props);
    this.state = {
      matchRuleExpanded: [],
      columns: [
        'URL Match Policy',
        'Match String',
        {
          title: 'Headers',
          cellTransforms: [compoundExpand]
        }
      ],
      childColumns: ['Header Key', 'Match Policy', 'Match String'],
      rows: this.getRows(),
      isUpdated: false
    };
    this.onExpand = this.onExpand.bind(this);
  }

  componentDidUpdate(prevProps) {
    if (!equal(this.props.trafficControl, prevProps.trafficControl)) {
      this.setState(() => {
        return {
          rows: this.getRows()
        };
      });
    }
  }

  getRows = (): IRow[] => {
    let rows: IRow[] = [];
    let parentCount = 0;
    this.props.trafficControl?.match.http?.map(matchRule => {
      const childRows: IRow[] = matchRule.headers.map(h => {
        return {
          isOpen: false,
          cells: [{ title: <>{h.key}</> }, { title: <>{h.match}</> }, { title: <>{h.stringMatch}</> }]
        };
      });

      rows.push({
        cells: [
          { title: <> {matchRule.uri.match}</>, props: { component: 'th' } },
          { title: <> {matchRule.uri.stringMatch}</>, props: { component: 'th' } },
          {
            title: (
              <React.Fragment>
                <CodeBranchIcon key="icon" /> {matchRule.headers.length}
              </React.Fragment>
            ),
            props: { isOpen: false, ariaControls: 'childTable' + parentCount }
          }
        ]
      });
      rows.push({
        isOpen: false,
        parent: parentCount,
        compoundParent: 2,
        cells: [
          {
            title: (
              <Table
                cells={this.state.childColumns}
                variant={TableVariant.compact}
                rows={childRows}
                className="pf-m-no-border-rows"
              >
                <TableHeader />
                <TableBody />
              </Table>
            ),
            props: { isOpen: false, className: 'pf-m-no-padding', colSpan: 3 }
          }
        ]
      });
      parentCount = 2 + parentCount;
    });
    return rows;
  };

  onExpand(_, rowIndex, colIndex, isOpen) {
    const { rows } = this.state;
    if (!isOpen) {
      // set all other expanded cells false in this row if we are expanding
      rows[rowIndex].cells.forEach(cell => {
        if (cell.props) cell.props.isOpen = false;
      });
      rows[rowIndex].cells[colIndex].props.isOpen = true;
      rows[rowIndex].isOpen = true;
    } else {
      rows[rowIndex].cells[colIndex].props.isOpen = false;
      rows[rowIndex].isOpen = rows[rowIndex].cells.some(cell => cell.props && cell.props.isOpen);
    }
    this.setState({
      rows
    });
  }
  render() {
    const { columns, rows } = this.state;
    return (
      <Table aria-label="Compound expandable table" onExpand={this.onExpand} rows={rows} cells={columns}>
        <TableHeader />
        {rows.length > 0 ? (
          <TableBody />
        ) : (
          <tr>
            <td colSpan={columns.length}>
              <EmptyState variant={EmptyStateVariant.full}>
                <Title headingLevel="h5" size="lg">
                  No Traffic Control found
                </Title>
                <EmptyStateBody>Experiment has not been started</EmptyStateBody>
              </EmptyState>
            </td>
          </tr>
        )}
      </Table>
    );
  }
}

export default TrafficControlInfo;
