import { Entity, PrimaryKey, Property } from '@mikro-orm/decorators/legacy';

@Entity()
export class AuthPackage {
  @PrimaryKey({ type: 'bigint' })
  id: bigint;

  @Property({ index: true })
  username: string;
}
