/*
 *  Copyright 2023 Collate.
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
import { Col, Row, Space, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import classNames from 'classnames';
import { sortBy } from 'lodash';
import QueryString from 'qs';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { getTableTabPath } from '../../../constants/constants';
import { Operation } from '../../../generated/entity/policies/policy';
import { EntityReference } from '../../../generated/entity/type';
import {
  TestCase,
  TestCaseResult,
  TestCaseStatus,
} from '../../../generated/tests/testCase';
import { getNameFromFQN } from '../../../utils/CommonUtils';
import {
  formatDate,
  formatDateTime,
} from '../../../utils/date-time/DateTimeUtils';
import { getEntityName } from '../../../utils/EntityUtils';
import { checkPermission } from '../../../utils/PermissionsUtils';
import { getEncodedFqn, replacePlus } from '../../../utils/StringsUtils';
import { getEntityFqnFromEntityLink } from '../../../utils/TableUtils';
import AppBadge from '../../common/Badge/Badge.component';
import FilterTablePlaceHolder from '../../common/ErrorWithPlaceholder/FilterTablePlaceHolder';
import { StatusBox } from '../../common/LastRunGraph/LastRunGraph.component';
import NextPrevious from '../../common/NextPrevious/NextPrevious';
import { OwnerLabel } from '../../common/OwnerLabel/OwnerLabel.component';
import Table from '../../common/Table/Table';
import { usePermissionProvider } from '../../PermissionProvider/PermissionProvider';
import { ResourceEntity } from '../../PermissionProvider/PermissionProvider.interface';
import { TableProfilerTab } from '../../ProfilerDashboard/profilerDashboard.interface';
import { TestCaseResolutionCenterTableProps } from './TestCaseResolutionCenterTable.interface';

const TestCaseResolutionCenterTable = ({
  testCaseData,
  pagingData,
  showPagination,
}: TestCaseResolutionCenterTableProps) => {
  const { t } = useTranslation();
  const { permissions } = usePermissionProvider();

  const testCaseEditPermission = useMemo(() => {
    return checkPermission(
      Operation.EditAll,
      ResourceEntity.TEST_CASE,
      permissions
    );
  }, [permissions]);

  const sortedData = useMemo(
    () =>
      sortBy(testCaseData.data, (test) => {
        switch (test.testCaseResult?.testCaseStatus) {
          case TestCaseStatus.Failed:
            return 0;
          case TestCaseStatus.Aborted:
            return 1;
          case TestCaseStatus.Success:
            return 2;

          default:
            return 3;
        }
      }),
    [testCaseData.data]
  );

  const columns: ColumnsType<TestCase> = useMemo(
    () => [
      {
        title: t('label.name'),
        dataIndex: 'name',
        key: 'name',
        width: 300,
        render: (name: string, record) => {
          const status = record.testCaseResult?.testCaseStatus;

          return (
            <Space data-testid={name}>
              <Tooltip title={status}>
                <div>
                  <StatusBox status={status?.toLocaleLowerCase()} />
                </div>
              </Tooltip>

              <Typography.Paragraph className="m-0" style={{ maxWidth: 280 }}>
                {getEntityName(record)}
              </Typography.Paragraph>
            </Space>
          );
        },
      },
      {
        title: t('label.table'),
        dataIndex: 'entityLink',
        key: 'table',
        width: 150,
        render: (entityLink: string) => {
          const tableFqn = getEntityFqnFromEntityLink(entityLink);
          const name = getNameFromFQN(tableFqn);

          return (
            <Link
              data-testid="table-link"
              to={{
                pathname: getTableTabPath(getEncodedFqn(tableFqn), 'profiler'),
                search: QueryString.stringify({
                  activeTab: TableProfilerTab.DATA_QUALITY,
                }),
              }}
              onClick={(e) => e.stopPropagation()}>
              {name}
            </Link>
          );
        },
      },
      {
        title: t('label.test-suite'),
        dataIndex: 'testSuite',
        key: 'testSuite',
        width: 150,
      },
      {
        title: t('label.column'),
        dataIndex: 'entityLink',
        key: 'column',
        width: 150,
        render: (entityLink: string) => {
          const isColumn = entityLink.includes('::columns::');
          if (isColumn) {
            const name = getNameFromFQN(
              replacePlus(getEntityFqnFromEntityLink(entityLink, isColumn))
            );

            return name;
          }

          return '--';
        },
      },
      {
        title: t('label.execution-time'),
        dataIndex: 'executionTime',
        key: 'executionTime',
        width: 150,
        render: (result: TestCaseResult) =>
          result?.timestamp ? formatDateTime(result.timestamp) : '--',
      },
      {
        title: t('label.status'),
        dataIndex: 'testCaseResult',
        key: 'resolution',
        width: 100,
        render: (value: TestCaseResult) => {
          const label = value?.testCaseFailureStatus?.testCaseFailureStatusType;
          const failureStatus = value?.testCaseFailureStatus;

          return label ? (
            <Tooltip
              placement="bottom"
              title={
                failureStatus?.updatedAt &&
                `${formatDate(failureStatus.updatedAt)}
                        ${
                          failureStatus.updatedBy
                            ? 'by ' + failureStatus.updatedBy
                            : ''
                        }`
              }>
              <div>
                <AppBadge
                  className={classNames(
                    'resolution',
                    label.toLocaleLowerCase()
                  )}
                  label={label}
                />
              </div>
            </Tooltip>
          ) : (
            '--'
          );
        },
      },
      {
        title: t('label.severity'),
        dataIndex: 'severity',
        key: 'severity',
        width: 150,
      },
      {
        title: t('label.assignee'),
        dataIndex: 'assignee',
        key: 'assignee',
        width: 150,
        render: (assignee: EntityReference) => <OwnerLabel owner={assignee} />,
      },
      {
        title: t('label.reviewer'),
        dataIndex: 'reviewer',
        key: 'reviewer',
        render: (owner: EntityReference) => <OwnerLabel owner={owner} />,
      },
    ],
    [testCaseEditPermission, testCaseData.data]
  );

  return (
    <Row gutter={[16, 16]}>
      <Col span={24}>
        <Table
          bordered
          className="test-case-table-container"
          columns={columns}
          data-testid="test-case-table"
          dataSource={sortedData}
          loading={testCaseData.isLoading}
          locale={{
            emptyText: <FilterTablePlaceHolder />,
          }}
          pagination={false}
          rowKey="id"
          size="small"
        />
      </Col>
      <Col span={24}>
        {pagingData && showPagination && <NextPrevious {...pagingData} />}
      </Col>
      <Col />
    </Row>
  );
};

export default TestCaseResolutionCenterTable;