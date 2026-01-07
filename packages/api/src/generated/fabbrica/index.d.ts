import type { User } from "../prisma/client.js";
import type { Session } from "../prisma/client.js";
import type { Account } from "../prisma/client.js";
import type { Verification } from "../prisma/client.js";
import type { Role } from "../prisma/client.js";
import type { Prisma } from "../prisma/client.js";
import type { Resolver } from "@quramy/prisma-fabbrica/lib/internal";
export { resetSequence, registerScalarFieldValueGenerator, resetScalarFieldValueGenerator } from "@quramy/prisma-fabbrica/lib/internal";
type BuildDataOptions<TTransients extends Record<string, unknown>> = {
    readonly seq: number;
} & TTransients;
type TraitName = string | symbol;
type CallbackDefineOptions<TCreated, TCreateInput, TTransients extends Record<string, unknown>> = {
    onAfterBuild?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onBeforeCreate?: (createInput: TCreateInput, transientFields: TTransients) => void | PromiseLike<void>;
    onAfterCreate?: (created: TCreated, transientFields: TTransients) => void | PromiseLike<void>;
};
export declare const initialize: (options: import("@quramy/prisma-fabbrica/lib/internal").InitializeOptions) => void;
type UserFactoryDefineInput = {
    id?: string;
    email?: string;
    emailVerified?: boolean;
    name?: string;
    preferredName?: string | null;
    role?: Role;
    image?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    sessions?: Prisma.SessionCreateNestedManyWithoutUserInput;
    accounts?: Prisma.AccountCreateNestedManyWithoutUserInput;
};
type UserTransientFields = Record<string, unknown> & Partial<Record<keyof UserFactoryDefineInput, never>>;
type UserFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<UserFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;
type UserFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<UserFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: UserFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<User, Prisma.UserCreateInput, TTransients>;
type UserTraitKeys<TOptions extends UserFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface UserFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "User";
    build(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput>;
    buildList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<Prisma.UserCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Prisma.UserCreateInput[]>;
    pickForConnect(inputData: User): Pick<User, "id">;
    create(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User>;
    createList(list: readonly Partial<Prisma.UserCreateInput & TTransients>[]): PromiseLike<User[]>;
    createList(count: number, item?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<User[]>;
    createForConnect(inputData?: Partial<Prisma.UserCreateInput & TTransients>): PromiseLike<Pick<User, "id">>;
}
export interface UserFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends UserFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): UserFactoryInterfaceWithoutTraits<TTransients>;
}
interface UserFactoryBuilder {
    <TOptions extends UserFactoryDefineOptions>(options?: TOptions): UserFactoryInterface<{}, UserTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends UserTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends UserFactoryDefineOptions<TTransients>>(options?: TOptions) => UserFactoryInterface<TTransients, UserTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link User} model.
 *
 * @param options
 * @returns factory {@link UserFactoryInterface}
 */
export declare const defineUserFactory: UserFactoryBuilder;
type SessionuserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutSessionsInput["create"]>;
};
type SessionFactoryDefineInput = {
    id?: string;
    expiresAt?: Date;
    token?: string;
    ipAddress?: string | null;
    userAgent?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    user: SessionuserFactory | Prisma.UserCreateNestedOneWithoutSessionsInput;
};
type SessionTransientFields = Record<string, unknown> & Partial<Record<keyof SessionFactoryDefineInput, never>>;
type SessionFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<SessionFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Session, Prisma.SessionCreateInput, TTransients>;
type SessionFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<SessionFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: SessionFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Session, Prisma.SessionCreateInput, TTransients>;
type SessionTraitKeys<TOptions extends SessionFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface SessionFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Session";
    build(inputData?: Partial<Prisma.SessionCreateInput & TTransients>): PromiseLike<Prisma.SessionCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.SessionCreateInput & TTransients>): PromiseLike<Prisma.SessionCreateInput>;
    buildList(list: readonly Partial<Prisma.SessionCreateInput & TTransients>[]): PromiseLike<Prisma.SessionCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.SessionCreateInput & TTransients>): PromiseLike<Prisma.SessionCreateInput[]>;
    pickForConnect(inputData: Session): Pick<Session, "id">;
    create(inputData?: Partial<Prisma.SessionCreateInput & TTransients>): PromiseLike<Session>;
    createList(list: readonly Partial<Prisma.SessionCreateInput & TTransients>[]): PromiseLike<Session[]>;
    createList(count: number, item?: Partial<Prisma.SessionCreateInput & TTransients>): PromiseLike<Session[]>;
    createForConnect(inputData?: Partial<Prisma.SessionCreateInput & TTransients>): PromiseLike<Pick<Session, "id">>;
}
export interface SessionFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends SessionFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): SessionFactoryInterfaceWithoutTraits<TTransients>;
}
interface SessionFactoryBuilder {
    <TOptions extends SessionFactoryDefineOptions>(options: TOptions): SessionFactoryInterface<{}, SessionTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends SessionTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends SessionFactoryDefineOptions<TTransients>>(options: TOptions) => SessionFactoryInterface<TTransients, SessionTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Session} model.
 *
 * @param options
 * @returns factory {@link SessionFactoryInterface}
 */
export declare const defineSessionFactory: SessionFactoryBuilder;
type AccountuserFactory = {
    _factoryFor: "User";
    build: () => PromiseLike<Prisma.UserCreateNestedOneWithoutAccountsInput["create"]>;
};
type AccountFactoryDefineInput = {
    id?: string;
    accountId?: string;
    providerId?: string;
    accessToken?: string | null;
    refreshToken?: string | null;
    idToken?: string | null;
    accessTokenExpiresAt?: Date | null;
    refreshTokenExpiresAt?: Date | null;
    scope?: string | null;
    password?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
    user: AccountuserFactory | Prisma.UserCreateNestedOneWithoutAccountsInput;
};
type AccountTransientFields = Record<string, unknown> & Partial<Record<keyof AccountFactoryDefineInput, never>>;
type AccountFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<AccountFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Account, Prisma.AccountCreateInput, TTransients>;
type AccountFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData: Resolver<AccountFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: string | symbol]: AccountFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Account, Prisma.AccountCreateInput, TTransients>;
type AccountTraitKeys<TOptions extends AccountFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface AccountFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Account";
    build(inputData?: Partial<Prisma.AccountCreateInput & TTransients>): PromiseLike<Prisma.AccountCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.AccountCreateInput & TTransients>): PromiseLike<Prisma.AccountCreateInput>;
    buildList(list: readonly Partial<Prisma.AccountCreateInput & TTransients>[]): PromiseLike<Prisma.AccountCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.AccountCreateInput & TTransients>): PromiseLike<Prisma.AccountCreateInput[]>;
    pickForConnect(inputData: Account): Pick<Account, "id">;
    create(inputData?: Partial<Prisma.AccountCreateInput & TTransients>): PromiseLike<Account>;
    createList(list: readonly Partial<Prisma.AccountCreateInput & TTransients>[]): PromiseLike<Account[]>;
    createList(count: number, item?: Partial<Prisma.AccountCreateInput & TTransients>): PromiseLike<Account[]>;
    createForConnect(inputData?: Partial<Prisma.AccountCreateInput & TTransients>): PromiseLike<Pick<Account, "id">>;
}
export interface AccountFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends AccountFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): AccountFactoryInterfaceWithoutTraits<TTransients>;
}
interface AccountFactoryBuilder {
    <TOptions extends AccountFactoryDefineOptions>(options: TOptions): AccountFactoryInterface<{}, AccountTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends AccountTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends AccountFactoryDefineOptions<TTransients>>(options: TOptions) => AccountFactoryInterface<TTransients, AccountTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Account} model.
 *
 * @param options
 * @returns factory {@link AccountFactoryInterface}
 */
export declare const defineAccountFactory: AccountFactoryBuilder;
type VerificationFactoryDefineInput = {
    id?: string;
    identifier?: string;
    value?: string;
    expiresAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
};
type VerificationTransientFields = Record<string, unknown> & Partial<Record<keyof VerificationFactoryDefineInput, never>>;
type VerificationFactoryTrait<TTransients extends Record<string, unknown>> = {
    data?: Resolver<Partial<VerificationFactoryDefineInput>, BuildDataOptions<TTransients>>;
} & CallbackDefineOptions<Verification, Prisma.VerificationCreateInput, TTransients>;
type VerificationFactoryDefineOptions<TTransients extends Record<string, unknown> = Record<string, unknown>> = {
    defaultData?: Resolver<VerificationFactoryDefineInput, BuildDataOptions<TTransients>>;
    traits?: {
        [traitName: TraitName]: VerificationFactoryTrait<TTransients>;
    };
} & CallbackDefineOptions<Verification, Prisma.VerificationCreateInput, TTransients>;
type VerificationTraitKeys<TOptions extends VerificationFactoryDefineOptions<any>> = Exclude<keyof TOptions["traits"], number>;
export interface VerificationFactoryInterfaceWithoutTraits<TTransients extends Record<string, unknown>> {
    readonly _factoryFor: "Verification";
    build(inputData?: Partial<Prisma.VerificationCreateInput & TTransients>): PromiseLike<Prisma.VerificationCreateInput>;
    buildCreateInput(inputData?: Partial<Prisma.VerificationCreateInput & TTransients>): PromiseLike<Prisma.VerificationCreateInput>;
    buildList(list: readonly Partial<Prisma.VerificationCreateInput & TTransients>[]): PromiseLike<Prisma.VerificationCreateInput[]>;
    buildList(count: number, item?: Partial<Prisma.VerificationCreateInput & TTransients>): PromiseLike<Prisma.VerificationCreateInput[]>;
    pickForConnect(inputData: Verification): Pick<Verification, "id">;
    create(inputData?: Partial<Prisma.VerificationCreateInput & TTransients>): PromiseLike<Verification>;
    createList(list: readonly Partial<Prisma.VerificationCreateInput & TTransients>[]): PromiseLike<Verification[]>;
    createList(count: number, item?: Partial<Prisma.VerificationCreateInput & TTransients>): PromiseLike<Verification[]>;
    createForConnect(inputData?: Partial<Prisma.VerificationCreateInput & TTransients>): PromiseLike<Pick<Verification, "id">>;
}
export interface VerificationFactoryInterface<TTransients extends Record<string, unknown> = Record<string, unknown>, TTraitName extends TraitName = TraitName> extends VerificationFactoryInterfaceWithoutTraits<TTransients> {
    use(name: TTraitName, ...names: readonly TTraitName[]): VerificationFactoryInterfaceWithoutTraits<TTransients>;
}
interface VerificationFactoryBuilder {
    <TOptions extends VerificationFactoryDefineOptions>(options?: TOptions): VerificationFactoryInterface<{}, VerificationTraitKeys<TOptions>>;
    withTransientFields: <TTransients extends VerificationTransientFields>(defaultTransientFieldValues: TTransients) => <TOptions extends VerificationFactoryDefineOptions<TTransients>>(options?: TOptions) => VerificationFactoryInterface<TTransients, VerificationTraitKeys<TOptions>>;
}
/**
 * Define factory for {@link Verification} model.
 *
 * @param options
 * @returns factory {@link VerificationFactoryInterface}
 */
export declare const defineVerificationFactory: VerificationFactoryBuilder;
//# sourceMappingURL=index.d.ts.map