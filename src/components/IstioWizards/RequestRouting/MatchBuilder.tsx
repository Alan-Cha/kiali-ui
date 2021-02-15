import * as React from 'react';
import { Button, Dropdown, DropdownToggle, DropdownItem, InputGroup, TextInput } from '@patternfly/react-core';

type Props = {
  category: string;
  operator: string;
  headerName: string;
  matchValue: string;
  isValid: boolean;
  matchOptions: string[];
  opOptions: string[];
  onSelectCategory: (category: string) => void;
  onHeaderNameChange: (headerName: string) => void;
  onSelectOperator: (operator: string) => void;
  onMatchValueChange: (matchValue: string) => void;
  onAddMatch: () => void;
};

type State = {
  isMatchDropdown: boolean;
  isOperatorDropdown: boolean;
};

// Match options
export const HEADERS = 'headers';
export const URI = 'uri';
export const SCHEME = 'scheme';
export const METHOD = 'method';
export const AUTHORITY = 'authority';

// Operators
export const EXACT = 'exact';
export const PREFIX = 'prefix';
export const REGEX = 'regex';

export const opOptions: string[] = [EXACT, PREFIX, REGEX];

// Pseudo operator
export const PRESENCE = 'is present';
export const ANYTHING = '^.*$';

const placeholderText = {
  [HEADERS]: 'Header value...',
  [URI]: 'Uri value...',
  [SCHEME]: 'Scheme value...',
  [METHOD]: 'Method value...',
  [AUTHORITY]: 'Authority value...'
};

class MatchBuilder extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      isMatchDropdown: false,
      isOperatorDropdown: false
    };
  }

  onMatchOptionsToggle = () => {
    this.setState({
      isMatchDropdown: !this.state.isMatchDropdown
    });
  };

  onOperatorToggle = () => {
    this.setState({
      isOperatorDropdown: !this.state.isOperatorDropdown
    });
  };

  render() {
    return (
      <InputGroup>
        <Dropdown
          toggle={<DropdownToggle onToggle={this.onMatchOptionsToggle}>{this.props.category}</DropdownToggle>}
          isOpen={this.state.isMatchDropdown}
          dropdownItems={this.props.matchOptions.map((mode, index) => (
            <DropdownItem
              key={mode + '_' + index}
              value={mode}
              component="button"
              onClick={() => {
                this.props.onSelectCategory(mode);
                this.onMatchOptionsToggle();
              }}
            >
              {mode}
            </DropdownItem>
          ))}
        />
        {this.props.category === HEADERS && (
          <TextInput
            id="header-name-id"
            value={this.props.headerName}
            onChange={this.props.onHeaderNameChange}
            placeholder="Header name..."
          />
        )}
        <Dropdown
          toggle={<DropdownToggle onToggle={this.onOperatorToggle}>{this.props.operator}</DropdownToggle>}
          isOpen={this.state.isOperatorDropdown}
          dropdownItems={this.props.opOptions.map((op, index) => (
            <DropdownItem
              key={op + '_' + index}
              value={op}
              component="button"
              onClick={() => {
                this.props.onSelectOperator(op);
                this.onOperatorToggle();
              }}
            >
              {op}
            </DropdownItem>
          ))}
        />
        {this.props.operator !== PRESENCE && (
          <TextInput
            id="match-value-id"
            value={this.props.matchValue}
            onChange={this.props.onMatchValueChange}
            placeholder={placeholderText[this.props.category]}
          />
        )}
        <Button variant="secondary" disabled={!this.props.isValid} onClick={this.props.onAddMatch}>
          Add Match
        </Button>
      </InputGroup>
    );
  }
}

export default MatchBuilder;
