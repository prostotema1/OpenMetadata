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

import Icon from '@ant-design/icons';
import { Tooltip } from 'antd';
import { ExpandableConfig } from 'antd/lib/table/interface';
import { ReactComponent as IconTerm } from 'assets/svg/book.svg';
import { ReactComponent as ClassificationIcon } from 'assets/svg/classification.svg';
import { ReactComponent as GlossaryIcon } from 'assets/svg/glossary.svg';
import { ReactComponent as ContainerIcon } from 'assets/svg/ic-storage.svg';
import classNames from 'classnames';
import { SourceType } from 'components/searched-data/SearchedData.interface';
import { t } from 'i18next';
import { uniqueId, upperCase } from 'lodash';
import { EntityTags } from 'Models';
import React from 'react';
import { ReactComponent as IconDataModel } from '../assets/svg/data-model.svg';
import { ReactComponent as IconDrag } from '../assets/svg/drag.svg';
import { ReactComponent as IconForeignKeyLineThrough } from '../assets/svg/foreign-key-line-through.svg';
import { ReactComponent as IconForeignKey } from '../assets/svg/foreign-key.svg';
import { ReactComponent as IconDown } from '../assets/svg/ic-arrow-down.svg';
import { ReactComponent as IconRight } from '../assets/svg/ic-arrow-right.svg';
import { ReactComponent as DashboardIcon } from '../assets/svg/ic-dashboard.svg';
import { ReactComponent as MlModelIcon } from '../assets/svg/ic-ml-model.svg';
import { ReactComponent as PipelineIcon } from '../assets/svg/ic-pipeline.svg';
import { ReactComponent as TableIcon } from '../assets/svg/ic-table.svg';
import { ReactComponent as TopicIcon } from '../assets/svg/ic-topic.svg';
import { ReactComponent as IconKeyLineThrough } from '../assets/svg/icon-key-line-through.svg';
import { ReactComponent as IconKey } from '../assets/svg/icon-key.svg';
import { ReactComponent as IconNotNullLineThrough } from '../assets/svg/icon-not-null-line-through.svg';
import { ReactComponent as IconNotNull } from '../assets/svg/icon-not-null.svg';
import { ReactComponent as IconUniqueLineThrough } from '../assets/svg/icon-unique-line-through.svg';
import { ReactComponent as IconUnique } from '../assets/svg/icon-unique.svg';
import { ReactComponent as IconTeam} from '../assets/svg/teams-grey.svg'
import { FQN_SEPARATOR_CHAR } from '../constants/char.constants';
import {
  DE_ACTIVE_COLOR,
  getContainerDetailPath,
  getDashboardDetailsPath,
  getDatabaseDetailsPath,
  getDatabaseSchemaDetailsPath,
  getDataModelDetailsPath,
  getEditWebhookPath,
  getMlModelPath,
  getPipelineDetailsPath,
  getServiceDetailsPath,
  getTableDetailsPath,
  getTableTabPath,
  getTagsDetailsPath,
  getTopicDetailsPath,
  getTeamDetailsPath,
  TEXT_BODY_COLOR,
} from '../constants/constants';
import { GlobalSettingsMenuCategory } from '../constants/GlobalSettings.constants';
import { EntityTabs, EntityType, FqnPart } from '../enums/entity.enum';
import { SearchIndex } from '../enums/search.enum';
import { ConstraintTypes, PrimaryTableDataTypes } from '../enums/table.enum';
import {
  Column,
  DataType,
  TableConstraint,
} from '../generated/entity/data/table';
import { TagLabel } from '../generated/type/tagLabel';
import {
  getPartialNameFromTableFQN,
  getTableFQNFromColumnFQN,
  sortTagsCaseInsensitive,
} from './CommonUtils';
import { getGlossaryPath, getSettingPath } from './RouterUtils';
import { serviceTypeLogo } from './ServiceUtils';
import { getDecodedFqn, ordinalize } from './StringsUtils';

export const getUsagePercentile = (pctRank: number, isLiteral = false) => {
  const percentile = Math.round(pctRank * 10) / 10;
  const ordinalPercentile = ordinalize(percentile);
  const usagePercentile = `${
    isLiteral ? t('label.usage') : ''
  } ${ordinalPercentile} ${t('label.pctile-lowercase')}`;

  return usagePercentile;
};

export const getTierFromTableTags = (
  tags: Array<EntityTags>
): EntityTags['tagFQN'] => {
  const tierTag = tags.find(
    (item) =>
      item.tagFQN.startsWith(`Tier${FQN_SEPARATOR_CHAR}Tier`) &&
      !isNaN(parseInt(item.tagFQN.substring(9).trim()))
  );

  return tierTag?.tagFQN || '';
};

export const getTierTags = (tags: Array<TagLabel>) => {
  const tierTag = tags.find(
    (item) =>
      item.tagFQN.startsWith(`Tier${FQN_SEPARATOR_CHAR}Tier`) &&
      !isNaN(parseInt(item.tagFQN.substring(9).trim()))
  );

  return tierTag;
};

export const getTagsWithoutTier = (
  tags: Array<EntityTags>
): Array<EntityTags> => {
  return tags.filter(
    (item) =>
      !item.tagFQN.startsWith(`Tier${FQN_SEPARATOR_CHAR}Tier`) ||
      isNaN(parseInt(item.tagFQN.substring(9).trim()))
  );
};

export const getConstraintIcon = ({
  constraint = '',
  className = '',
  width = '16px',
  isConstraintAdded,
  isConstraintDeleted,
}: {
  constraint?: string;
  className?: string;
  width?: string;
  isConstraintAdded?: boolean;
  isConstraintDeleted?: boolean;
}) => {
  let title: string, icon: SvgComponent, dataTestId: string;
  switch (constraint) {
    case ConstraintTypes.PRIMARY_KEY:
      {
        title = t('label.primary-key');
        icon = isConstraintDeleted ? IconKeyLineThrough : IconKey;
        dataTestId = 'primary-key';
      }

      break;
    case ConstraintTypes.UNIQUE:
      {
        title = t('label.unique');
        icon = isConstraintDeleted ? IconUniqueLineThrough : IconUnique;
        dataTestId = 'unique';
      }

      break;
    case ConstraintTypes.NOT_NULL:
      {
        title = t('label.not-null');
        icon = isConstraintDeleted ? IconNotNullLineThrough : IconNotNull;
        dataTestId = 'not-null';
      }

      break;
    case ConstraintTypes.FOREIGN_KEY:
      {
        title = t('label.foreign-key');
        icon = isConstraintDeleted ? IconForeignKeyLineThrough : IconForeignKey;
        dataTestId = 'foreign-key';
      }

      break;
    default:
      return null;
  }

  return (
    <Tooltip
      className={classNames(className)}
      placement="bottom"
      title={title}
      trigger="hover">
      <Icon
        alt={title}
        className={classNames({
          'diff-added': isConstraintAdded,
          'diff-removed': isConstraintDeleted,
        })}
        component={icon}
        data-testid={`constraint-icon-${dataTestId}`}
        style={{ fontSize: width }}
      />
    </Tooltip>
  );
};

export const getEntityLink = (
  indexType: string,
  fullyQualifiedName: string
) => {
  // encode the FQN for entities that can have "/" in their names
  fullyQualifiedName = encodeURIComponent(fullyQualifiedName);
  switch (indexType) {
    case SearchIndex.TOPIC:
    case EntityType.TOPIC:
      return getTopicDetailsPath(getDecodedFqn(fullyQualifiedName));

    case SearchIndex.DASHBOARD:
    case EntityType.DASHBOARD:
      return getDashboardDetailsPath(getDecodedFqn(fullyQualifiedName));

    case SearchIndex.PIPELINE:
    case EntityType.PIPELINE:
      return getPipelineDetailsPath(getDecodedFqn(fullyQualifiedName));

    case EntityType.DATABASE:
      return getDatabaseDetailsPath(getDecodedFqn(fullyQualifiedName));

    case EntityType.DATABASE_SCHEMA:
      return getDatabaseSchemaDetailsPath(getDecodedFqn(fullyQualifiedName));

    case EntityType.GLOSSARY:
    case EntityType.GLOSSARY_TERM:
    case SearchIndex.GLOSSARY:
      return getGlossaryPath(getDecodedFqn(fullyQualifiedName));

    case EntityType.DATABASE_SERVICE:
    case EntityType.DASHBOARD_SERVICE:
    case EntityType.MESSAGING_SERVICE:
    case EntityType.PIPELINE_SERVICE:
      return getServiceDetailsPath(fullyQualifiedName, `${indexType}s`);

    case EntityType.WEBHOOK:
      return getEditWebhookPath(fullyQualifiedName);

    case EntityType.TYPE:
      return getSettingPath(
        GlobalSettingsMenuCategory.CUSTOM_ATTRIBUTES,
        `${fullyQualifiedName}s`
      );

    case EntityType.TEAM:
    case SearchIndex.TEAM:
        return getTeamDetailsPath(fullyQualifiedName)

    case EntityType.MLMODEL:
    case SearchIndex.MLMODEL:
      return getMlModelPath(fullyQualifiedName);

    case EntityType.CONTAINER:
    case SearchIndex.CONTAINER:
      return getContainerDetailPath(getDecodedFqn(fullyQualifiedName));
    case SearchIndex.TAG:
      return getTagsDetailsPath(fullyQualifiedName);
    case EntityType.DASHBOARD_DATA_MODEL:
      return getDataModelDetailsPath(getDecodedFqn(fullyQualifiedName));



    case EntityType.TEST_CASE:
      return `${getTableTabPath(
        getTableFQNFromColumnFQN(fullyQualifiedName),
        EntityTabs.PROFILER
      )}?activeTab=Data Quality`;

    case SearchIndex.TABLE:
    case EntityType.TABLE:
    default:
      return getTableDetailsPath(getDecodedFqn(fullyQualifiedName));
  }
};

export const getServiceIcon = (source: SourceType) => {
  if (source.entityType === EntityType.GLOSSARY_TERM) {
    return <GlossaryIcon className="h-7" style={{ color: DE_ACTIVE_COLOR }} />;
  } else if (source.entityType === EntityType.TAG) {
    return (
      <ClassificationIcon className="h-7" style={{ color: DE_ACTIVE_COLOR }} />
    );
  } else {
    return (
      <img
        alt="service-icon"
        className="inline h-7"
        src={serviceTypeLogo(source.serviceType || '')}
      />
    );
  }
};

export const getEntityIcon = (indexType: string) => {
  switch (indexType) {
    case SearchIndex.TOPIC:
    case EntityType.TOPIC:
      return <TopicIcon />;

    case SearchIndex.DASHBOARD:
    case EntityType.DASHBOARD:
      return <DashboardIcon />;

    case SearchIndex.MLMODEL:
    case EntityType.MLMODEL:
      return <MlModelIcon />;

    case SearchIndex.PIPELINE:
    case EntityType.PIPELINE:
      return <PipelineIcon />;

    case SearchIndex.CONTAINER:
    case EntityType.CONTAINER:
      return <ContainerIcon />;

    case EntityType.DASHBOARD_DATA_MODEL:
      return <IconDataModel />;

    case EntityType.TAG:
      return <ClassificationIcon />;
    case EntityType.GLOSSARY:
      return <GlossaryIcon />;
    case EntityType.GLOSSARY_TERM:
      return <IconTerm />;

    case SearchIndex.TEAM:
    case EntityType.TEAM:
        return <IconTeam/>
    case SearchIndex.TABLE:
    case EntityType.TABLE:
    default:
      return <TableIcon />;
  }
};

export const makeRow = (column: Column) => {
  return {
    description: column.description || '',
    // Sorting tags as the response of PATCH request does not return the sorted order
    // of tags, but is stored in sorted manner in the database
    // which leads to wrong PATCH payload sent after further tags removal
    tags: sortTagsCaseInsensitive(column.tags || []),
    key: column?.name,
    ...column,
  };
};

export const makeData = (
  columns: Column[] = []
): Array<Column & { id: string }> => {
  return columns.map((column) => ({
    ...makeRow(column),
    id: uniqueId(column.name),
    children: column.children ? makeData(column.children) : undefined,
  }));
};

export const getDataTypeString = (dataType: string): string => {
  switch (upperCase(dataType)) {
    case DataType.String:
    case DataType.Char:
    case DataType.Text:
    case DataType.Varchar:
    case DataType.Mediumtext:
    case DataType.Mediumblob:
    case DataType.Blob:
      return PrimaryTableDataTypes.VARCHAR;
    case DataType.Timestamp:
    case DataType.Time:
      return PrimaryTableDataTypes.TIMESTAMP;
    case DataType.Date:
      return PrimaryTableDataTypes.DATE;
    case DataType.Int:
    case DataType.Float:
    case DataType.Smallint:
    case DataType.Bigint:
    case DataType.Numeric:
    case DataType.Tinyint:
    case DataType.Decimal:
      return PrimaryTableDataTypes.NUMERIC;
    case DataType.Boolean:
    case DataType.Enum:
      return PrimaryTableDataTypes.BOOLEAN;
    default:
      return dataType;
  }
};

export const generateEntityLink = (fqn: string, includeColumn = false) => {
  const columnLink = '<#E::table::ENTITY_FQN::columns::COLUMN>';
  const tableLink = '<#E::table::ENTITY_FQN>';

  if (includeColumn) {
    const tableFqn = getTableFQNFromColumnFQN(fqn);
    const columnName = getPartialNameFromTableFQN(fqn, [FqnPart.NestedColumn]);

    return columnLink
      .replace('ENTITY_FQN', tableFqn)
      .replace('COLUMN', columnName);
  } else {
    return tableLink.replace('ENTITY_FQN', fqn);
  }
};

export const getEntityFqnFromEntityLink = (
  entityLink: string,
  includeColumn = false
) => {
  const link = entityLink.split('>')[0];
  const entityLinkData = link.split('::');
  const tableFqn = entityLinkData[2];

  if (includeColumn) {
    return `${tableFqn}.${entityLinkData[entityLinkData.length - 1]}`;
  }

  return tableFqn;
};

export function getTableExpandableConfig<T>(
  isDraggable?: boolean
): ExpandableConfig<T> {
  const expandableConfig: ExpandableConfig<T> = {
    expandIcon: ({ expanded, onExpand, expandable, record }) =>
      expandable ? (
        <div className="d-inline-flex items-center">
          {isDraggable && (
            <IconDrag className="m-r-xs drag-icon" height={12} width={12} />
          )}
          <Icon
            className="m-r-xs"
            component={expanded ? IconDown : IconRight}
            data-testid="expand-icon"
            style={{ fontSize: '10px', color: TEXT_BODY_COLOR }}
            onClick={(e) => onExpand(record, e)}
          />
        </div>
      ) : (
        isDraggable && (
          <>
            <IconDrag className="m-r-xs drag-icon" height={12} width={12} />
            <div className="expand-cell-empty-icon-container" />
          </>
        )
      ),
  };

  return expandableConfig;
}

export const prepareConstraintIcon = ({
  columnName,
  columnConstraint,
  tableConstraints,
  iconClassName,
  iconWidth,
  isColumnConstraintAdded,
  isColumnConstraintDeleted,
  isTableConstraintAdded,
  isTableConstraintDeleted,
}: {
  columnName: string;
  columnConstraint?: string;
  tableConstraints?: TableConstraint[];
  iconClassName?: string;
  iconWidth?: string;
  isColumnConstraintAdded?: boolean;
  isColumnConstraintDeleted?: boolean;
  isTableConstraintAdded?: boolean;
  isTableConstraintDeleted?: boolean;
}) => {
  // get the table constraints for column
  const filteredTableConstraints = tableConstraints?.filter((constraint) =>
    constraint.columns?.includes(columnName)
  );

  // prepare column constraint element
  const columnConstraintEl = columnConstraint
    ? getConstraintIcon({
        constraint: columnConstraint,
        className: iconClassName || 'm-r-xs',
        width: iconWidth,
        isConstraintAdded: isColumnConstraintAdded,
        isConstraintDeleted: isColumnConstraintDeleted,
      })
    : null;

  // prepare table constraint element
  const tableConstraintEl = filteredTableConstraints
    ? filteredTableConstraints.map((tableConstraint) =>
        getConstraintIcon({
          constraint: tableConstraint.constraintType,
          className: iconClassName || 'm-r-xs',
          width: iconWidth,
          isConstraintAdded: isTableConstraintAdded,
          isConstraintDeleted: isTableConstraintDeleted,
        })
      )
    : null;

  return (
    <span data-testid="constraints">
      {columnConstraintEl} {tableConstraintEl}
    </span>
  );
};
