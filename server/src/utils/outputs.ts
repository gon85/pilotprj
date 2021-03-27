import {GraphQLInt, GraphQLString} from 'graphql';
import {ClassType, Field, ObjectType} from 'type-graphql';

export function ListableResponse<T>(TClass: ClassType<T>): any {
  @ObjectType({isAbstract: true})
  abstract class ListableResponseClass {
    @Field(() => [TClass])
    list!: T[];

    @Field(() => GraphQLInt, {description: 'Total count'})
    totalCount!: number;

    @Field(() => GraphQLInt, {description: 'page index (1-based)'})
    page!: number;

    @Field(() => GraphQLInt, {description: 'page size'})
    pageSize!: number;
  }
  return ListableResponseClass;
}

@ObjectType()
export class CodeInfo {
  @Field(() => GraphQLString, {description: 'code'})
  code!: string;

  @Field(() => GraphQLString, {description: '보여지는 명칭'})
  name!: string;

  @Field(() => GraphQLInt, {description: '순서'})
  order!: number;

  static convert<T>(enumValues: any[], enumToName: {[key: string]: string}): CodeInfo[] {
    const codes: CodeInfo[] = [];
    for (let i = 0; i < enumValues.length; i++) {
      const val = enumValues[i] as T;
      codes.push({
        code: val + '',
        name: enumToName[val + ''],
        order: i,
      });
    }

    return codes;
  }
}
