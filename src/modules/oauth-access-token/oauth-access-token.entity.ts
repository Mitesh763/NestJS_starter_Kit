import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('oauth_access_tokens')
export class OAuthAccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column()
  tokenId: string;

  @Column()
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  updated_at: Date;

  @Column({ nullable: true })
  deleted_at: Date;
}
