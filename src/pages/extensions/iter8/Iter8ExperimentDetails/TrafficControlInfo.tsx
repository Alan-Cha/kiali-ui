import * as React from 'react';
import { TrafficControl } from '../../../../types/Iter8';
import { Table, TableBody, TableHeader, IRow, ICell, cellWidth } from '@patternfly/react-table';
import { EmptyState, EmptyStateBody, EmptyStateVariant, Title } from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import styles from '@patternfly/react-styles/css/components/Table/table';
import equal from 'fast-deep-equal';

interface TrafficControlInfoProps {
  trafficControl: TrafficControl;
}

type State = {
  matchRuleExpanded: string[];
  columns: any;
  rows: any;
  isUpdated: boolean;
};

class TrafficControlInfo extends React.Component<TrafficControlInfoProps, State> {
  constructor(props: TrafficControlInfoProps) {
    super(props);
    this.state = {
      matchRuleExpanded: [],
      columns: [
        {
          title: ''
        },
        'URL Match Policy',
        'Match String'
      ],
      rows: this.getRows(),
      isUpdated: false
    };
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

    this.props.trafficControl?.match.http?.map(matchRule => {
      const childRows: IRow[] = matchRule.headers.map(h => {
        return {
          cells: [{}, { title: <>{h.key}</> }, { title: <>{h.match}</> }, { title: <>{h.stringMatch}</> }]
        };
      });

      let number = rows.push({
        isOpen: false,
        cells: [{ title: <> </> }, { title: <> {matchRule.uri.match}</> }, { title: <> {matchRule.uri.stringMatch}</> }]
      });

      rows.push({
        parent: number - 1,
        fullWidth: true,
        cells: [
          <>
            <Table aria-label="Simple Table" cells={this.columns()} rows={childRows}>
              <TableHeader />
              <TableBody />
            </Table>
          </>
        ]
      });
      return rows;
    });
    return rows;
  };

  columns = (): ICell[] => {
    return [
      { title: '', transforms: [cellWidth(20) as any] },
      { title: 'Header Key', transforms: [cellWidth(25) as any] },
      { title: 'Match Policy', transforms: [cellWidth(25) as any] },
      { title: 'Match String' }
    ];
  };

  onCollapse = (_, rowKey, isOpen) => {
    const { rows } = this.state;
    /**
     * Please do not use rowKey as row index for more complex tables.
     * Rather use some kind of identifier like ID passed with each row.
     */
    rows[rowKey].isOpen = isOpen;
    this.setState({
      rows
    });
  };

  customRowWrapper = ({ trRef, className, rowProps, row: { isExpanded, isHeightAuto }, ...props }) => {
    const dangerErrorStyle = {
      borderLeft: '3px solid var(--pf-global--primary-color--100)'
    };

    return (
      <tr
        {...props}
        ref={trRef}
        className={css(
          className,
          'custom-static-class',
          isExpanded !== undefined && styles.tableExpandableRow,
          isExpanded && styles.modifiers.expanded,
          isHeightAuto && styles.modifiers.heightAuto
        )}
        hidden={isExpanded !== undefined && !isExpanded}
        style={dangerErrorStyle}
      />
    );
  };

  render() {
    const { columns, rows } = this.state;
    return (
      <Table
        aria-label="SpanTable"
        className={'spanTracingTagsTable'}
        onCollapse={this.onCollapse}
        rows={rows}
        cells={columns}
      >
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
