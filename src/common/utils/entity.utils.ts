import { Injectable } from '@nestjs/common';
import { CONSTANTS } from 'src/config/constants';
import { DataSource } from 'typeorm';

@Injectable()
export class EntityUtils {
  constructor(private readonly dataSource: DataSource) {}

  getRelations({
    entity,
    relations = [],
    isSkipRelations = false,
  }: {
    entity: any;
    relations?: string[];
    isSkipRelations?: boolean;
  }): string[] {
    if (isSkipRelations) {
      return [];
    }

    const metadata = this.dataSource.getMetadata(entity);
    const relationNames = metadata.relations.map(
      (relation) => relation.propertyName,
    );

    if (relations.length) {
      return relationNames.filter((relation) => relations.includes(relation));
    }

    if (relationNames.includes('comments')) {
      // Only 3 levels of comments can be obtained (0, 1, 2)
      relationNames.push(
        ...[
          'comments.parent',
          'comments.children',
          'comments.children.parent',
          'comments.children.children',
          'comments.children.children.parent',
        ],
      );
    }

    if (relationNames.includes('children')) {
      relationNames.push(
        // Only 3 levels of comments can be obtained (0, 1, 2)
        ...['children.parent', 'children.children', 'children.children.parent'],
      );
    }

    return relationNames;
  }

  getSelect({
    entity,
    properties = [],
    isSkipSensitives = true,
  }: {
    entity: any;
    properties?: string[];
    isSkipSensitives: boolean;
  }): any[] {
    const metadata = this.dataSource.getMetadata(entity);
    let columns = metadata.columns.map((column) => column.propertyName);

    if (isSkipSensitives) {
      columns = columns.filter(
        (column) => !CONSTANTS.SENSITIVE_FIELDS.includes(column),
      );
    }

    if (properties.length > 0) {
      columns = columns.filter((column) => properties.includes(column));
    }

    return columns;
  }
}
