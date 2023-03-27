/*
 *  Copyright 2022 Collate.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { getAllByTestId, getByTestId, render } from '@testing-library/react';
import React from 'react';
import { MemoryRouter } from 'react-router';
import { EntitiesCount } from '../../generated/entity/utils/entitiesCount';
import MyAssetStats from './MyAssetStats.component';

const mockProp = {
  entityState: {
    entityCounts: {
      tableCount: 40,
      topicCount: 13,
      dashboardCount: 10,
      pipelineCount: 3,
      mlmodelCount: 2,
      testSuiteCount: 1,
      storageContainerCount: 1,
      glossaryTermCount: 1,
      servicesCount: 193,
      userCount: 100,
      teamCount: 7,
    } as EntitiesCount,
    entityCountLoading: false,
  },
};

describe('Test MyDataHeader Component', () => {
  it('Component should render', () => {
    const { container } = render(<MyAssetStats {...mockProp} />, {
      wrapper: MemoryRouter,
    });

    const myDataHeader = getByTestId(container, 'data-summary-container');

    expect(myDataHeader).toBeInTheDocument();
  });

  it('Should have 11 data summary details', () => {
    const { container } = render(<MyAssetStats {...mockProp} />, {
      wrapper: MemoryRouter,
    });

    const dataSummary = getAllByTestId(container, /-summary$/);

    expect(dataSummary).toHaveLength(11);
  });

  it('OnClick it should redirect to respective page', () => {
    const { container } = render(<MyAssetStats {...mockProp} />, {
      wrapper: MemoryRouter,
    });
    const tables = getByTestId(container, 'tables');
    const topics = getByTestId(container, 'topics');
    const dashboards = getByTestId(container, 'dashboards');
    const pipelines = getByTestId(container, 'pipelines');
    const mlmodel = getByTestId(container, 'mlmodels');
    const containers = getByTestId(container, 'containers');
    const glossaryTerms = getByTestId(container, 'glossary-terms');
    const service = getByTestId(container, 'service');
    const user = getByTestId(container, 'user');
    const teams = getByTestId(container, 'teams');

    expect(tables).toHaveAttribute('href', '/explore/tables');
    expect(topics).toHaveAttribute('href', '/explore/topics');
    expect(dashboards).toHaveAttribute('href', '/explore/dashboards');
    expect(pipelines).toHaveAttribute('href', '/explore/pipelines');
    expect(mlmodel).toHaveAttribute('href', '/explore/mlmodels');
    expect(containers).toHaveAttribute('href', '/explore/containers');
    expect(glossaryTerms).toHaveAttribute('href', '/glossary');
    expect(service).toHaveAttribute('href', '/settings/services/databases');
    expect(user).toHaveAttribute('href', '/settings/members/users');
    expect(teams).toHaveAttribute(
      'href',
      '/settings/members/teams/Organization'
    );
  });

  it('Should have correct count', () => {
    const { container } = render(<MyAssetStats {...mockProp} />, {
      wrapper: MemoryRouter,
    });
    const tables = getByTestId(container, 'tables-summary');
    const topics = getByTestId(container, 'topics-summary');
    const dashboards = getByTestId(container, 'dashboards-summary');
    const pipelines = getByTestId(container, 'pipelines-summary');
    const mlmodel = getByTestId(container, 'mlmodels-summary');
    const containers = getByTestId(container, 'containers-summary');
    const glossaryTerms = getByTestId(container, 'glossary-terms-summary');
    const testSuite = getByTestId(container, 'test-suite-summary');
    const service = getByTestId(container, 'service-summary');
    const user = getByTestId(container, 'user-summary');
    const teams = getByTestId(container, 'teams-summary');

    expect(getByTestId(tables, 'filter-count')).toHaveTextContent('40');
    expect(getByTestId(topics, 'filter-count')).toHaveTextContent('13');
    expect(getByTestId(dashboards, 'filter-count')).toHaveTextContent('10');
    expect(getByTestId(pipelines, 'filter-count')).toHaveTextContent('3');
    expect(getByTestId(mlmodel, 'filter-count')).toHaveTextContent('2');
    expect(getByTestId(containers, 'filter-count')).toHaveTextContent('1');
    expect(getByTestId(glossaryTerms, 'filter-count')).toHaveTextContent('1');
    expect(getByTestId(testSuite, 'filter-count')).toHaveTextContent('1');
    expect(getByTestId(service, 'filter-count')).toHaveTextContent('193');
    expect(getByTestId(user, 'filter-count')).toHaveTextContent('100');
    expect(getByTestId(teams, 'filter-count')).toHaveTextContent('7');
  });
});
