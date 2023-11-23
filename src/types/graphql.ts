import { GraphQLResolveInfo, GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Void: any;
};

export type AuthInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Comment = {
  __typename?: 'Comment';
  comment: Scalars['String'];
  createdAt?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  idPost: Post;
  idUser: User;
};

export type CommentInput = {
  comment: Scalars['String'];
  idPost: Scalars['ID'];
};

export type FeedPost = {
  __typename?: 'FeedPost';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  idUser: User;
  typeFile: Scalars['String'];
  urlFile: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addComment: Comment;
  authUser: Token;
  deleteAvatar: User;
  dislike?: Maybe<Scalars['Void']>;
  follow?: Maybe<Scalars['Void']>;
  like?: Maybe<Scalars['Void']>;
  newUser?: Maybe<User>;
  publish: Post;
  unFollow?: Maybe<Scalars['Void']>;
  updateAvatar: User;
  updateUser: User;
};


export type MutationAddCommentArgs = {
  input: CommentInput;
};


export type MutationAuthUserArgs = {
  input: AuthInput;
};


export type MutationDislikeArgs = {
  idPost: Scalars['ID'];
};


export type MutationFollowArgs = {
  username: Scalars['String'];
};


export type MutationLikeArgs = {
  idPost: Scalars['ID'];
};


export type MutationNewUserArgs = {
  input: UserInput;
};


export type MutationPublishArgs = {
  typeFile: Scalars['String'];
  urlFile: Scalars['String'];
};


export type MutationUnFollowArgs = {
  username: Scalars['String'];
};


export type MutationUpdateAvatarArgs = {
  urlImage: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  input: UserUpdateInput;
};

export type Post = {
  __typename?: 'Post';
  createdAt: Scalars['String'];
  id: Scalars['ID'];
  idUser: Scalars['ID'];
  typeFile: Scalars['String'];
  urlFile: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  countLikes?: Maybe<Scalars['Int']>;
  generateUploadUrl: UploadUrl;
  getComments: Array<Comment>;
  getFeed: Array<FeedPost>;
  getFollowers: Array<User>;
  getFollowings: Array<User>;
  getNotFollowings: Array<User>;
  getPosts: Array<Post>;
  getUser: User;
  isFollowing?: Maybe<Scalars['Boolean']>;
  isLike?: Maybe<Scalars['Boolean']>;
  searchUsers: Array<User>;
};


export type QueryCountLikesArgs = {
  idPost: Scalars['ID'];
};


export type QueryGenerateUploadUrlArgs = {
  folder: Scalars['String'];
  uploadType: UploadType;
};


export type QueryGetCommentsArgs = {
  idPost: Scalars['ID'];
};


export type QueryGetFollowersArgs = {
  username: Scalars['String'];
};


export type QueryGetFollowingsArgs = {
  username: Scalars['String'];
};


export type QueryGetPostsArgs = {
  username: Scalars['String'];
};


export type QueryGetUserArgs = {
  id?: InputMaybe<Scalars['ID']>;
  username?: InputMaybe<Scalars['String']>;
};


export type QueryIsFollowingArgs = {
  username: Scalars['String'];
};


export type QueryIsLikeArgs = {
  idPost: Scalars['ID'];
};


export type QuerySearchUsersArgs = {
  search: Scalars['String'];
};

export type Token = {
  __typename?: 'Token';
  token?: Maybe<Scalars['String']>;
};

export enum UploadType {
  Avatar = 'Avatar',
  Post = 'Post'
}

export type UploadUrl = {
  __typename?: 'UploadUrl';
  public_id: Scalars['String'];
  signature: Scalars['String'];
  timestamp: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  avatar?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
  website?: Maybe<Scalars['String']>;
};

export type UserInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type UserUpdateInput = {
  description?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  newPassword?: InputMaybe<Scalars['String']>;
  oldPassword?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};



export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  AuthInput: AuthInput;
  Boolean: ResolverTypeWrapper<Scalars['Boolean']>;
  Comment: ResolverTypeWrapper<Comment>;
  CommentInput: CommentInput;
  FeedPost: ResolverTypeWrapper<FeedPost>;
  ID: ResolverTypeWrapper<Scalars['ID']>;
  Int: ResolverTypeWrapper<Scalars['Int']>;
  Mutation: ResolverTypeWrapper<{}>;
  Post: ResolverTypeWrapper<Post>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']>;
  Token: ResolverTypeWrapper<Token>;
  UploadType: UploadType;
  UploadUrl: ResolverTypeWrapper<UploadUrl>;
  User: ResolverTypeWrapper<User>;
  UserInput: UserInput;
  UserUpdateInput: UserUpdateInput;
  Void: ResolverTypeWrapper<Scalars['Void']>;
};

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = {
  AuthInput: AuthInput;
  Boolean: Scalars['Boolean'];
  Comment: Comment;
  CommentInput: CommentInput;
  FeedPost: FeedPost;
  ID: Scalars['ID'];
  Int: Scalars['Int'];
  Mutation: {};
  Post: Post;
  Query: {};
  String: Scalars['String'];
  Token: Token;
  UploadUrl: UploadUrl;
  User: User;
  UserInput: UserInput;
  UserUpdateInput: UserUpdateInput;
  Void: Scalars['Void'];
};

export type CommentResolvers<ContextType = any, ParentType extends ResolversParentTypes['Comment'] = ResolversParentTypes['Comment']> = {
  comment?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idPost?: Resolver<ResolversTypes['Post'], ParentType, ContextType>;
  idUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type FeedPostResolvers<ContextType = any, ParentType extends ResolversParentTypes['FeedPost'] = ResolversParentTypes['FeedPost']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idUser?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  typeFile?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  urlFile?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type MutationResolvers<ContextType = any, ParentType extends ResolversParentTypes['Mutation'] = ResolversParentTypes['Mutation']> = {
  addComment?: Resolver<ResolversTypes['Comment'], ParentType, ContextType, RequireFields<MutationAddCommentArgs, 'input'>>;
  authUser?: Resolver<ResolversTypes['Token'], ParentType, ContextType, RequireFields<MutationAuthUserArgs, 'input'>>;
  deleteAvatar?: Resolver<ResolversTypes['User'], ParentType, ContextType>;
  dislike?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationDislikeArgs, 'idPost'>>;
  follow?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationFollowArgs, 'username'>>;
  like?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationLikeArgs, 'idPost'>>;
  newUser?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, RequireFields<MutationNewUserArgs, 'input'>>;
  publish?: Resolver<ResolversTypes['Post'], ParentType, ContextType, RequireFields<MutationPublishArgs, 'typeFile' | 'urlFile'>>;
  unFollow?: Resolver<Maybe<ResolversTypes['Void']>, ParentType, ContextType, RequireFields<MutationUnFollowArgs, 'username'>>;
  updateAvatar?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateAvatarArgs, 'urlImage'>>;
  updateUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, RequireFields<MutationUpdateUserArgs, 'input'>>;
};

export type PostResolvers<ContextType = any, ParentType extends ResolversParentTypes['Post'] = ResolversParentTypes['Post']> = {
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  idUser?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  typeFile?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  urlFile?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type QueryResolvers<ContextType = any, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = {
  countLikes?: Resolver<Maybe<ResolversTypes['Int']>, ParentType, ContextType, RequireFields<QueryCountLikesArgs, 'idPost'>>;
  generateUploadUrl?: Resolver<ResolversTypes['UploadUrl'], ParentType, ContextType, RequireFields<QueryGenerateUploadUrlArgs, 'folder' | 'uploadType'>>;
  getComments?: Resolver<Array<ResolversTypes['Comment']>, ParentType, ContextType, RequireFields<QueryGetCommentsArgs, 'idPost'>>;
  getFeed?: Resolver<Array<ResolversTypes['FeedPost']>, ParentType, ContextType>;
  getFollowers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetFollowersArgs, 'username'>>;
  getFollowings?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QueryGetFollowingsArgs, 'username'>>;
  getNotFollowings?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType>;
  getPosts?: Resolver<Array<ResolversTypes['Post']>, ParentType, ContextType, RequireFields<QueryGetPostsArgs, 'username'>>;
  getUser?: Resolver<ResolversTypes['User'], ParentType, ContextType, Partial<QueryGetUserArgs>>;
  isFollowing?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<QueryIsFollowingArgs, 'username'>>;
  isLike?: Resolver<Maybe<ResolversTypes['Boolean']>, ParentType, ContextType, RequireFields<QueryIsLikeArgs, 'idPost'>>;
  searchUsers?: Resolver<Array<ResolversTypes['User']>, ParentType, ContextType, RequireFields<QuerySearchUsersArgs, 'search'>>;
};

export type TokenResolvers<ContextType = any, ParentType extends ResolversParentTypes['Token'] = ResolversParentTypes['Token']> = {
  token?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UploadUrlResolvers<ContextType = any, ParentType extends ResolversParentTypes['UploadUrl'] = ResolversParentTypes['UploadUrl']> = {
  public_id?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  signature?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  timestamp?: Resolver<ResolversTypes['Int'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export type UserResolvers<ContextType = any, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = {
  avatar?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  createdAt?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  description?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  email?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  password?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  username?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  website?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
};

export interface VoidScalarConfig extends GraphQLScalarTypeConfig<ResolversTypes['Void'], any> {
  name: 'Void';
}

export type Resolvers<ContextType = any> = {
  Comment?: CommentResolvers<ContextType>;
  FeedPost?: FeedPostResolvers<ContextType>;
  Mutation?: MutationResolvers<ContextType>;
  Post?: PostResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  Token?: TokenResolvers<ContextType>;
  UploadUrl?: UploadUrlResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  Void?: GraphQLScalarType;
};

