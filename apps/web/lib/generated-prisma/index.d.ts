
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model DimensionScore
 * 
 */
export type DimensionScore = $Result.DefaultSelection<Prisma.$DimensionScorePayload>
/**
 * Model User
 * 
 */
export type User = $Result.DefaultSelection<Prisma.$UserPayload>
/**
 * Model Dimension
 * 
 */
export type Dimension = $Result.DefaultSelection<Prisma.$DimensionPayload>
/**
 * Model UserAttribute
 * 
 */
export type UserAttribute = $Result.DefaultSelection<Prisma.$UserAttributePayload>
/**
 * Model DimensionInput
 * 
 */
export type DimensionInput = $Result.DefaultSelection<Prisma.$DimensionInputPayload>
/**
 * Model LifeState
 * 
 */
export type LifeState = $Result.DefaultSelection<Prisma.$LifeStatePayload>
/**
 * Model LifeEvent
 * 
 */
export type LifeEvent = $Result.DefaultSelection<Prisma.$LifeEventPayload>
/**
 * Model Goal
 * 
 */
export type Goal = $Result.DefaultSelection<Prisma.$GoalPayload>
/**
 * Model GoalAction
 * 
 */
export type GoalAction = $Result.DefaultSelection<Prisma.$GoalActionPayload>
/**
 * Model Task
 * 
 */
export type Task = $Result.DefaultSelection<Prisma.$TaskPayload>
/**
 * Model ChatSession
 * 
 */
export type ChatSession = $Result.DefaultSelection<Prisma.$ChatSessionPayload>
/**
 * Model ChatMessage
 * 
 */
export type ChatMessage = $Result.DefaultSelection<Prisma.$ChatMessagePayload>

/**
 * ##  Prisma Client ʲˢ
 * 
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more Users
 * const users = await prisma.user.findMany()
 * ```
 *
 * 
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   * 
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more Users
   * const users = await prisma.user.findMany()
   * ```
   *
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): void;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

  /**
   * Add a middleware
   * @deprecated since 4.16.0. For new code, prefer client extensions instead.
   * @see https://pris.ly/d/extensions
   */
  $use(cb: Prisma.Middleware): void

/**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P]): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number }): $Utils.JsPromise<R>

  /**
   * Executes a raw MongoDB command and returns the result of it.
   * @example
   * ```
   * const user = await prisma.$runCommandRaw({
   *   aggregate: 'User',
   *   pipeline: [{ $match: { name: 'Bob' } }, { $project: { email: true, _id: false } }],
   *   explain: false,
   * })
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $runCommandRaw(command: Prisma.InputJsonObject): Prisma.PrismaPromise<Prisma.JsonObject>

  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb, ExtArgs>

      /**
   * `prisma.user`: Exposes CRUD operations for the **User** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Users
    * const users = await prisma.user.findMany()
    * ```
    */
  get user(): Prisma.UserDelegate<ExtArgs>;

  /**
   * `prisma.dimension`: Exposes CRUD operations for the **Dimension** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Dimensions
    * const dimensions = await prisma.dimension.findMany()
    * ```
    */
  get dimension(): Prisma.DimensionDelegate<ExtArgs>;

  /**
   * `prisma.userAttribute`: Exposes CRUD operations for the **UserAttribute** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more UserAttributes
    * const userAttributes = await prisma.userAttribute.findMany()
    * ```
    */
  get userAttribute(): Prisma.UserAttributeDelegate<ExtArgs>;

  /**
   * `prisma.dimensionInput`: Exposes CRUD operations for the **DimensionInput** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more DimensionInputs
    * const dimensionInputs = await prisma.dimensionInput.findMany()
    * ```
    */
  get dimensionInput(): Prisma.DimensionInputDelegate<ExtArgs>;

  /**
   * `prisma.lifeState`: Exposes CRUD operations for the **LifeState** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LifeStates
    * const lifeStates = await prisma.lifeState.findMany()
    * ```
    */
  get lifeState(): Prisma.LifeStateDelegate<ExtArgs>;

  /**
   * `prisma.lifeEvent`: Exposes CRUD operations for the **LifeEvent** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more LifeEvents
    * const lifeEvents = await prisma.lifeEvent.findMany()
    * ```
    */
  get lifeEvent(): Prisma.LifeEventDelegate<ExtArgs>;

  /**
   * `prisma.goal`: Exposes CRUD operations for the **Goal** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Goals
    * const goals = await prisma.goal.findMany()
    * ```
    */
  get goal(): Prisma.GoalDelegate<ExtArgs>;

  /**
   * `prisma.goalAction`: Exposes CRUD operations for the **GoalAction** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more GoalActions
    * const goalActions = await prisma.goalAction.findMany()
    * ```
    */
  get goalAction(): Prisma.GoalActionDelegate<ExtArgs>;

  /**
   * `prisma.task`: Exposes CRUD operations for the **Task** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more Tasks
    * const tasks = await prisma.task.findMany()
    * ```
    */
  get task(): Prisma.TaskDelegate<ExtArgs>;

  /**
   * `prisma.chatSession`: Exposes CRUD operations for the **ChatSession** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatSessions
    * const chatSessions = await prisma.chatSession.findMany()
    * ```
    */
  get chatSession(): Prisma.ChatSessionDelegate<ExtArgs>;

  /**
   * `prisma.chatMessage`: Exposes CRUD operations for the **ChatMessage** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ChatMessages
    * const chatMessages = await prisma.chatMessage.findMany()
    * ```
    */
  get chatMessage(): Prisma.ChatMessageDelegate<ExtArgs>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError
  export import NotFoundError = runtime.NotFoundError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics 
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 5.22.0
   * Query Engine version: 605197351a3c8bdd595af2d2a9bc3025bca48ea2
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion 

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    * 
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    * 
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   * 
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? K : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    User: 'User',
    Dimension: 'Dimension',
    UserAttribute: 'UserAttribute',
    DimensionInput: 'DimensionInput',
    LifeState: 'LifeState',
    LifeEvent: 'LifeEvent',
    Goal: 'Goal',
    GoalAction: 'GoalAction',
    Task: 'Task',
    ChatSession: 'ChatSession',
    ChatMessage: 'ChatMessage'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb extends $Utils.Fn<{extArgs: $Extensions.InternalArgs, clientOptions: PrismaClientOptions }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], this['params']['clientOptions']>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, ClientOptions = {}> = {
    meta: {
      modelProps: "user" | "dimension" | "userAttribute" | "dimensionInput" | "lifeState" | "lifeEvent" | "goal" | "goalAction" | "task" | "chatSession" | "chatMessage"
      txIsolationLevel: never
    }
    model: {
      User: {
        payload: Prisma.$UserPayload<ExtArgs>
        fields: Prisma.UserFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findFirst: {
            args: Prisma.UserFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          findMany: {
            args: Prisma.UserFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>[]
          }
          create: {
            args: Prisma.UserCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          createMany: {
            args: Prisma.UserCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          update: {
            args: Prisma.UserUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          deleteMany: {
            args: Prisma.UserDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserPayload>
          }
          aggregate: {
            args: Prisma.UserAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUser>
          }
          groupBy: {
            args: Prisma.UserGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UserCountArgs<ExtArgs>
            result: $Utils.Optional<UserCountAggregateOutputType> | number
          }
        }
      }
      Dimension: {
        payload: Prisma.$DimensionPayload<ExtArgs>
        fields: Prisma.DimensionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DimensionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DimensionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          findFirst: {
            args: Prisma.DimensionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DimensionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          findMany: {
            args: Prisma.DimensionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>[]
          }
          create: {
            args: Prisma.DimensionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          createMany: {
            args: Prisma.DimensionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DimensionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          update: {
            args: Prisma.DimensionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          deleteMany: {
            args: Prisma.DimensionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DimensionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DimensionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionPayload>
          }
          aggregate: {
            args: Prisma.DimensionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDimension>
          }
          groupBy: {
            args: Prisma.DimensionGroupByArgs<ExtArgs>
            result: $Utils.Optional<DimensionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.DimensionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.DimensionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.DimensionCountArgs<ExtArgs>
            result: $Utils.Optional<DimensionCountAggregateOutputType> | number
          }
        }
      }
      UserAttribute: {
        payload: Prisma.$UserAttributePayload<ExtArgs>
        fields: Prisma.UserAttributeFieldRefs
        operations: {
          findUnique: {
            args: Prisma.UserAttributeFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.UserAttributeFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload>
          }
          findFirst: {
            args: Prisma.UserAttributeFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.UserAttributeFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload>
          }
          findMany: {
            args: Prisma.UserAttributeFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload>[]
          }
          create: {
            args: Prisma.UserAttributeCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload>
          }
          createMany: {
            args: Prisma.UserAttributeCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.UserAttributeDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload>
          }
          update: {
            args: Prisma.UserAttributeUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload>
          }
          deleteMany: {
            args: Prisma.UserAttributeDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.UserAttributeUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.UserAttributeUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$UserAttributePayload>
          }
          aggregate: {
            args: Prisma.UserAttributeAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateUserAttribute>
          }
          groupBy: {
            args: Prisma.UserAttributeGroupByArgs<ExtArgs>
            result: $Utils.Optional<UserAttributeGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.UserAttributeFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.UserAttributeAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.UserAttributeCountArgs<ExtArgs>
            result: $Utils.Optional<UserAttributeCountAggregateOutputType> | number
          }
        }
      }
      DimensionInput: {
        payload: Prisma.$DimensionInputPayload<ExtArgs>
        fields: Prisma.DimensionInputFieldRefs
        operations: {
          findUnique: {
            args: Prisma.DimensionInputFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.DimensionInputFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload>
          }
          findFirst: {
            args: Prisma.DimensionInputFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.DimensionInputFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload>
          }
          findMany: {
            args: Prisma.DimensionInputFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload>[]
          }
          create: {
            args: Prisma.DimensionInputCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload>
          }
          createMany: {
            args: Prisma.DimensionInputCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.DimensionInputDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload>
          }
          update: {
            args: Prisma.DimensionInputUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload>
          }
          deleteMany: {
            args: Prisma.DimensionInputDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.DimensionInputUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.DimensionInputUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$DimensionInputPayload>
          }
          aggregate: {
            args: Prisma.DimensionInputAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateDimensionInput>
          }
          groupBy: {
            args: Prisma.DimensionInputGroupByArgs<ExtArgs>
            result: $Utils.Optional<DimensionInputGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.DimensionInputFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.DimensionInputAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.DimensionInputCountArgs<ExtArgs>
            result: $Utils.Optional<DimensionInputCountAggregateOutputType> | number
          }
        }
      }
      LifeState: {
        payload: Prisma.$LifeStatePayload<ExtArgs>
        fields: Prisma.LifeStateFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LifeStateFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LifeStateFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload>
          }
          findFirst: {
            args: Prisma.LifeStateFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LifeStateFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload>
          }
          findMany: {
            args: Prisma.LifeStateFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload>[]
          }
          create: {
            args: Prisma.LifeStateCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload>
          }
          createMany: {
            args: Prisma.LifeStateCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LifeStateDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload>
          }
          update: {
            args: Prisma.LifeStateUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload>
          }
          deleteMany: {
            args: Prisma.LifeStateDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LifeStateUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LifeStateUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeStatePayload>
          }
          aggregate: {
            args: Prisma.LifeStateAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLifeState>
          }
          groupBy: {
            args: Prisma.LifeStateGroupByArgs<ExtArgs>
            result: $Utils.Optional<LifeStateGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.LifeStateFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.LifeStateAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.LifeStateCountArgs<ExtArgs>
            result: $Utils.Optional<LifeStateCountAggregateOutputType> | number
          }
        }
      }
      LifeEvent: {
        payload: Prisma.$LifeEventPayload<ExtArgs>
        fields: Prisma.LifeEventFieldRefs
        operations: {
          findUnique: {
            args: Prisma.LifeEventFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.LifeEventFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          findFirst: {
            args: Prisma.LifeEventFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.LifeEventFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          findMany: {
            args: Prisma.LifeEventFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>[]
          }
          create: {
            args: Prisma.LifeEventCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          createMany: {
            args: Prisma.LifeEventCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.LifeEventDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          update: {
            args: Prisma.LifeEventUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          deleteMany: {
            args: Prisma.LifeEventDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.LifeEventUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.LifeEventUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$LifeEventPayload>
          }
          aggregate: {
            args: Prisma.LifeEventAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateLifeEvent>
          }
          groupBy: {
            args: Prisma.LifeEventGroupByArgs<ExtArgs>
            result: $Utils.Optional<LifeEventGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.LifeEventFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.LifeEventAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.LifeEventCountArgs<ExtArgs>
            result: $Utils.Optional<LifeEventCountAggregateOutputType> | number
          }
        }
      }
      Goal: {
        payload: Prisma.$GoalPayload<ExtArgs>
        fields: Prisma.GoalFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GoalFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GoalFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          findFirst: {
            args: Prisma.GoalFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GoalFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          findMany: {
            args: Prisma.GoalFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>[]
          }
          create: {
            args: Prisma.GoalCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          createMany: {
            args: Prisma.GoalCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GoalDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          update: {
            args: Prisma.GoalUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          deleteMany: {
            args: Prisma.GoalDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GoalUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GoalUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalPayload>
          }
          aggregate: {
            args: Prisma.GoalAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGoal>
          }
          groupBy: {
            args: Prisma.GoalGroupByArgs<ExtArgs>
            result: $Utils.Optional<GoalGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.GoalFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.GoalAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.GoalCountArgs<ExtArgs>
            result: $Utils.Optional<GoalCountAggregateOutputType> | number
          }
        }
      }
      GoalAction: {
        payload: Prisma.$GoalActionPayload<ExtArgs>
        fields: Prisma.GoalActionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.GoalActionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.GoalActionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload>
          }
          findFirst: {
            args: Prisma.GoalActionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.GoalActionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload>
          }
          findMany: {
            args: Prisma.GoalActionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload>[]
          }
          create: {
            args: Prisma.GoalActionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload>
          }
          createMany: {
            args: Prisma.GoalActionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.GoalActionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload>
          }
          update: {
            args: Prisma.GoalActionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload>
          }
          deleteMany: {
            args: Prisma.GoalActionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.GoalActionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.GoalActionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$GoalActionPayload>
          }
          aggregate: {
            args: Prisma.GoalActionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateGoalAction>
          }
          groupBy: {
            args: Prisma.GoalActionGroupByArgs<ExtArgs>
            result: $Utils.Optional<GoalActionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.GoalActionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.GoalActionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.GoalActionCountArgs<ExtArgs>
            result: $Utils.Optional<GoalActionCountAggregateOutputType> | number
          }
        }
      }
      Task: {
        payload: Prisma.$TaskPayload<ExtArgs>
        fields: Prisma.TaskFieldRefs
        operations: {
          findUnique: {
            args: Prisma.TaskFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.TaskFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findFirst: {
            args: Prisma.TaskFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.TaskFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          findMany: {
            args: Prisma.TaskFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>[]
          }
          create: {
            args: Prisma.TaskCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          createMany: {
            args: Prisma.TaskCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.TaskDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          update: {
            args: Prisma.TaskUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          deleteMany: {
            args: Prisma.TaskDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.TaskUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.TaskUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$TaskPayload>
          }
          aggregate: {
            args: Prisma.TaskAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateTask>
          }
          groupBy: {
            args: Prisma.TaskGroupByArgs<ExtArgs>
            result: $Utils.Optional<TaskGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.TaskFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.TaskAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.TaskCountArgs<ExtArgs>
            result: $Utils.Optional<TaskCountAggregateOutputType> | number
          }
        }
      }
      ChatSession: {
        payload: Prisma.$ChatSessionPayload<ExtArgs>
        fields: Prisma.ChatSessionFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatSessionFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatSessionFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findFirst: {
            args: Prisma.ChatSessionFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatSessionFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          findMany: {
            args: Prisma.ChatSessionFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>[]
          }
          create: {
            args: Prisma.ChatSessionCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          createMany: {
            args: Prisma.ChatSessionCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ChatSessionDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          update: {
            args: Prisma.ChatSessionUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          deleteMany: {
            args: Prisma.ChatSessionDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatSessionUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatSessionUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatSessionPayload>
          }
          aggregate: {
            args: Prisma.ChatSessionAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatSession>
          }
          groupBy: {
            args: Prisma.ChatSessionGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ChatSessionFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ChatSessionAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ChatSessionCountArgs<ExtArgs>
            result: $Utils.Optional<ChatSessionCountAggregateOutputType> | number
          }
        }
      }
      ChatMessage: {
        payload: Prisma.$ChatMessagePayload<ExtArgs>
        fields: Prisma.ChatMessageFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ChatMessageFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ChatMessageFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findFirst: {
            args: Prisma.ChatMessageFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ChatMessageFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          findMany: {
            args: Prisma.ChatMessageFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>[]
          }
          create: {
            args: Prisma.ChatMessageCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          createMany: {
            args: Prisma.ChatMessageCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ChatMessageDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          update: {
            args: Prisma.ChatMessageUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          deleteMany: {
            args: Prisma.ChatMessageDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ChatMessageUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ChatMessageUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ChatMessagePayload>
          }
          aggregate: {
            args: Prisma.ChatMessageAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateChatMessage>
          }
          groupBy: {
            args: Prisma.ChatMessageGroupByArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageGroupByOutputType>[]
          }
          findRaw: {
            args: Prisma.ChatMessageFindRawArgs<ExtArgs>
            result: JsonObject
          }
          aggregateRaw: {
            args: Prisma.ChatMessageAggregateRawArgs<ExtArgs>
            result: JsonObject
          }
          count: {
            args: Prisma.ChatMessageCountArgs<ExtArgs>
            result: $Utils.Optional<ChatMessageCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $runCommandRaw: {
          args: Prisma.InputJsonObject,
          result: Prisma.JsonObject
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Defaults to stdout
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events
     * log: [
     *   { emit: 'stdout', level: 'query' },
     *   { emit: 'stdout', level: 'info' },
     *   { emit: 'stdout', level: 'warn' }
     *   { emit: 'stdout', level: 'error' }
     * ]
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
    }
  }


  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type GetLogType<T extends LogLevel | LogDefinition> = T extends LogDefinition ? T['emit'] extends 'event' ? T['level'] : never : never
  export type GetEvents<T extends any> = T extends Array<LogLevel | LogDefinition> ?
    GetLogType<T[0]> | GetLogType<T[1]> | GetLogType<T[2]> | GetLogType<T[3]>
    : never

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  /**
   * These options are being passed into the middleware as "params"
   */
  export type MiddlewareParams = {
    model?: ModelName
    action: PrismaAction
    args: any
    dataPath: string[]
    runInTransaction: boolean
  }

  /**
   * The `T` type makes sure, that the `return proceed` is not forgotten in the middleware implementation
   */
  export type Middleware<T = any> = (
    params: MiddlewareParams,
    next: (params: MiddlewareParams) => $Utils.JsPromise<T>,
  ) => $Utils.JsPromise<T>

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type UserCountOutputType
   */

  export type UserCountOutputType = {
    attributes: number
    dimensionInputs: number
    lifeStates: number
    lifeEvents: number
    goals: number
    chatSessions: number
  }

  export type UserCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attributes?: boolean | UserCountOutputTypeCountAttributesArgs
    dimensionInputs?: boolean | UserCountOutputTypeCountDimensionInputsArgs
    lifeStates?: boolean | UserCountOutputTypeCountLifeStatesArgs
    lifeEvents?: boolean | UserCountOutputTypeCountLifeEventsArgs
    goals?: boolean | UserCountOutputTypeCountGoalsArgs
    chatSessions?: boolean | UserCountOutputTypeCountChatSessionsArgs
  }

  // Custom InputTypes
  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserCountOutputType
     */
    select?: UserCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountAttributesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAttributeWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountDimensionInputsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DimensionInputWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLifeStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeStateWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountLifeEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeEventWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountGoalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoalWhereInput
  }

  /**
   * UserCountOutputType without action
   */
  export type UserCountOutputTypeCountChatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
  }


  /**
   * Count Type DimensionCountOutputType
   */

  export type DimensionCountOutputType = {
    attributes: number
    dimensionInputs: number
  }

  export type DimensionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attributes?: boolean | DimensionCountOutputTypeCountAttributesArgs
    dimensionInputs?: boolean | DimensionCountOutputTypeCountDimensionInputsArgs
  }

  // Custom InputTypes
  /**
   * DimensionCountOutputType without action
   */
  export type DimensionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionCountOutputType
     */
    select?: DimensionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * DimensionCountOutputType without action
   */
  export type DimensionCountOutputTypeCountAttributesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAttributeWhereInput
  }

  /**
   * DimensionCountOutputType without action
   */
  export type DimensionCountOutputTypeCountDimensionInputsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DimensionInputWhereInput
  }


  /**
   * Count Type GoalCountOutputType
   */

  export type GoalCountOutputType = {
    actions: number
  }

  export type GoalCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    actions?: boolean | GoalCountOutputTypeCountActionsArgs
  }

  // Custom InputTypes
  /**
   * GoalCountOutputType without action
   */
  export type GoalCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalCountOutputType
     */
    select?: GoalCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GoalCountOutputType without action
   */
  export type GoalCountOutputTypeCountActionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoalActionWhereInput
  }


  /**
   * Count Type GoalActionCountOutputType
   */

  export type GoalActionCountOutputType = {
    tasks: number
  }

  export type GoalActionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    tasks?: boolean | GoalActionCountOutputTypeCountTasksArgs
  }

  // Custom InputTypes
  /**
   * GoalActionCountOutputType without action
   */
  export type GoalActionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalActionCountOutputType
     */
    select?: GoalActionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * GoalActionCountOutputType without action
   */
  export type GoalActionCountOutputTypeCountTasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
  }


  /**
   * Count Type ChatSessionCountOutputType
   */

  export type ChatSessionCountOutputType = {
    messages: number
  }

  export type ChatSessionCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatSessionCountOutputTypeCountMessagesArgs
  }

  // Custom InputTypes
  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSessionCountOutputType
     */
    select?: ChatSessionCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ChatSessionCountOutputType without action
   */
  export type ChatSessionCountOutputTypeCountMessagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
  }


  /**
   * Models
   */

  /**
   * Model DimensionScore
   */





  export type DimensionScoreSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    dimensionId?: boolean
    score?: boolean
    trend?: boolean
    confidence?: boolean
  }, ExtArgs["result"]["dimensionScore"]>


  export type DimensionScoreSelectScalar = {
    dimensionId?: boolean
    score?: boolean
    trend?: boolean
    confidence?: boolean
  }


  export type $DimensionScorePayload = {
    name: "DimensionScore"
    objects: {}
    scalars: {
      dimensionId: string
      score: number
      trend: string
      confidence: number | null
    }
    composites: {}
  }

  type DimensionScoreGetPayload<S extends boolean | null | undefined | DimensionScoreDefaultArgs> = $Result.GetResult<Prisma.$DimensionScorePayload, S>





  /**
   * Fields of the DimensionScore model
   */ 
  interface DimensionScoreFieldRefs {
    readonly dimensionId: FieldRef<"DimensionScore", 'String'>
    readonly score: FieldRef<"DimensionScore", 'Float'>
    readonly trend: FieldRef<"DimensionScore", 'String'>
    readonly confidence: FieldRef<"DimensionScore", 'Float'>
  }
    

  // Custom InputTypes
  /**
   * DimensionScore without action
   */
  export type DimensionScoreDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionScore
     */
    select?: DimensionScoreSelect<ExtArgs> | null
  }


  /**
   * Model User
   */

  export type AggregateUser = {
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  export type UserMinAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatarUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserMaxAggregateOutputType = {
    id: string | null
    email: string | null
    name: string | null
    avatarUrl: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type UserCountAggregateOutputType = {
    id: number
    email: number
    name: number
    avatarUrl: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type UserMinAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserMaxAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
  }

  export type UserCountAggregateInputType = {
    id?: true
    email?: true
    name?: true
    avatarUrl?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type UserAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which User to aggregate.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Users
    **/
    _count?: true | UserCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserMaxAggregateInputType
  }

  export type GetUserAggregateType<T extends UserAggregateArgs> = {
        [P in keyof T & keyof AggregateUser]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUser[P]>
      : GetScalarType<T[P], AggregateUser[P]>
  }




  export type UserGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserWhereInput
    orderBy?: UserOrderByWithAggregationInput | UserOrderByWithAggregationInput[]
    by: UserScalarFieldEnum[] | UserScalarFieldEnum
    having?: UserScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserCountAggregateInputType | true
    _min?: UserMinAggregateInputType
    _max?: UserMaxAggregateInputType
  }

  export type UserGroupByOutputType = {
    id: string
    email: string
    name: string | null
    avatarUrl: string | null
    createdAt: Date
    updatedAt: Date
    _count: UserCountAggregateOutputType | null
    _min: UserMinAggregateOutputType | null
    _max: UserMaxAggregateOutputType | null
  }

  type GetUserGroupByPayload<T extends UserGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserGroupByOutputType[P]>
            : GetScalarType<T[P], UserGroupByOutputType[P]>
        }
      >
    >


  export type UserSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    attributes?: boolean | User$attributesArgs<ExtArgs>
    dimensionInputs?: boolean | User$dimensionInputsArgs<ExtArgs>
    lifeStates?: boolean | User$lifeStatesArgs<ExtArgs>
    lifeEvents?: boolean | User$lifeEventsArgs<ExtArgs>
    goals?: boolean | User$goalsArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["user"]>


  export type UserSelectScalar = {
    id?: boolean
    email?: boolean
    name?: boolean
    avatarUrl?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type UserInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attributes?: boolean | User$attributesArgs<ExtArgs>
    dimensionInputs?: boolean | User$dimensionInputsArgs<ExtArgs>
    lifeStates?: boolean | User$lifeStatesArgs<ExtArgs>
    lifeEvents?: boolean | User$lifeEventsArgs<ExtArgs>
    goals?: boolean | User$goalsArgs<ExtArgs>
    chatSessions?: boolean | User$chatSessionsArgs<ExtArgs>
    _count?: boolean | UserCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $UserPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "User"
    objects: {
      attributes: Prisma.$UserAttributePayload<ExtArgs>[]
      dimensionInputs: Prisma.$DimensionInputPayload<ExtArgs>[]
      lifeStates: Prisma.$LifeStatePayload<ExtArgs>[]
      lifeEvents: Prisma.$LifeEventPayload<ExtArgs>[]
      goals: Prisma.$GoalPayload<ExtArgs>[]
      chatSessions: Prisma.$ChatSessionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      email: string
      name: string | null
      avatarUrl: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["user"]>
    composites: {}
  }

  type UserGetPayload<S extends boolean | null | undefined | UserDefaultArgs> = $Result.GetResult<Prisma.$UserPayload, S>

  type UserCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserCountAggregateInputType | true
    }

  export interface UserDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['User'], meta: { name: 'User' } }
    /**
     * Find zero or one User that matches the filter.
     * @param {UserFindUniqueArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserFindUniqueArgs>(args: SelectSubset<T, UserFindUniqueArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one User that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserFindUniqueOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserFindUniqueOrThrowArgs>(args: SelectSubset<T, UserFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first User that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserFindFirstArgs>(args?: SelectSubset<T, UserFindFirstArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first User that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindFirstOrThrowArgs} args - Arguments to find a User
     * @example
     * // Get one User
     * const user = await prisma.user.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserFindFirstOrThrowArgs>(args?: SelectSubset<T, UserFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Users
     * const users = await prisma.user.findMany()
     * 
     * // Get first 10 Users
     * const users = await prisma.user.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userWithIdOnly = await prisma.user.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserFindManyArgs>(args?: SelectSubset<T, UserFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a User.
     * @param {UserCreateArgs} args - Arguments to create a User.
     * @example
     * // Create one User
     * const User = await prisma.user.create({
     *   data: {
     *     // ... data to create a User
     *   }
     * })
     * 
     */
    create<T extends UserCreateArgs>(args: SelectSubset<T, UserCreateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Users.
     * @param {UserCreateManyArgs} args - Arguments to create many Users.
     * @example
     * // Create many Users
     * const user = await prisma.user.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserCreateManyArgs>(args?: SelectSubset<T, UserCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a User.
     * @param {UserDeleteArgs} args - Arguments to delete one User.
     * @example
     * // Delete one User
     * const User = await prisma.user.delete({
     *   where: {
     *     // ... filter to delete one User
     *   }
     * })
     * 
     */
    delete<T extends UserDeleteArgs>(args: SelectSubset<T, UserDeleteArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one User.
     * @param {UserUpdateArgs} args - Arguments to update one User.
     * @example
     * // Update one User
     * const user = await prisma.user.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserUpdateArgs>(args: SelectSubset<T, UserUpdateArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Users.
     * @param {UserDeleteManyArgs} args - Arguments to filter Users to delete.
     * @example
     * // Delete a few Users
     * const { count } = await prisma.user.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserDeleteManyArgs>(args?: SelectSubset<T, UserDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Users
     * const user = await prisma.user.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserUpdateManyArgs>(args: SelectSubset<T, UserUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one User.
     * @param {UserUpsertArgs} args - Arguments to update or create a User.
     * @example
     * // Update or create a User
     * const user = await prisma.user.upsert({
     *   create: {
     *     // ... data to create a User
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the User we want to update
     *   }
     * })
     */
    upsert<T extends UserUpsertArgs>(args: SelectSubset<T, UserUpsertArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Users that matches the filter.
     * @param {UserFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const user = await prisma.user.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: UserFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a User.
     * @param {UserAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const user = await prisma.user.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UserAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Users.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserCountArgs} args - Arguments to filter Users to count.
     * @example
     * // Count the number of Users
     * const count = await prisma.user.count({
     *   where: {
     *     // ... the filter for the Users we want to count
     *   }
     * })
    **/
    count<T extends UserCountArgs>(
      args?: Subset<T, UserCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAggregateArgs>(args: Subset<T, UserAggregateArgs>): Prisma.PrismaPromise<GetUserAggregateType<T>>

    /**
     * Group by User.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserGroupByArgs['orderBy'] }
        : { orderBy?: UserGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the User model
   */
  readonly fields: UserFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for User.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attributes<T extends User$attributesArgs<ExtArgs> = {}>(args?: Subset<T, User$attributesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "findMany"> | Null>
    dimensionInputs<T extends User$dimensionInputsArgs<ExtArgs> = {}>(args?: Subset<T, User$dimensionInputsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "findMany"> | Null>
    lifeStates<T extends User$lifeStatesArgs<ExtArgs> = {}>(args?: Subset<T, User$lifeStatesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "findMany"> | Null>
    lifeEvents<T extends User$lifeEventsArgs<ExtArgs> = {}>(args?: Subset<T, User$lifeEventsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findMany"> | Null>
    goals<T extends User$goalsArgs<ExtArgs> = {}>(args?: Subset<T, User$goalsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findMany"> | Null>
    chatSessions<T extends User$chatSessionsArgs<ExtArgs> = {}>(args?: Subset<T, User$chatSessionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the User model
   */ 
  interface UserFieldRefs {
    readonly id: FieldRef<"User", 'String'>
    readonly email: FieldRef<"User", 'String'>
    readonly name: FieldRef<"User", 'String'>
    readonly avatarUrl: FieldRef<"User", 'String'>
    readonly createdAt: FieldRef<"User", 'DateTime'>
    readonly updatedAt: FieldRef<"User", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * User findUnique
   */
  export type UserFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findUniqueOrThrow
   */
  export type UserFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User findFirst
   */
  export type UserFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findFirstOrThrow
   */
  export type UserFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which User to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Users.
     */
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User findMany
   */
  export type UserFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter, which Users to fetch.
     */
    where?: UserWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Users to fetch.
     */
    orderBy?: UserOrderByWithRelationInput | UserOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Users.
     */
    cursor?: UserWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Users from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Users.
     */
    skip?: number
    distinct?: UserScalarFieldEnum | UserScalarFieldEnum[]
  }

  /**
   * User create
   */
  export type UserCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to create a User.
     */
    data: XOR<UserCreateInput, UserUncheckedCreateInput>
  }

  /**
   * User createMany
   */
  export type UserCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Users.
     */
    data: UserCreateManyInput | UserCreateManyInput[]
  }

  /**
   * User update
   */
  export type UserUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The data needed to update a User.
     */
    data: XOR<UserUpdateInput, UserUncheckedUpdateInput>
    /**
     * Choose, which User to update.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User updateMany
   */
  export type UserUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Users.
     */
    data: XOR<UserUpdateManyMutationInput, UserUncheckedUpdateManyInput>
    /**
     * Filter which Users to update
     */
    where?: UserWhereInput
  }

  /**
   * User upsert
   */
  export type UserUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * The filter to search for the User to update in case it exists.
     */
    where: UserWhereUniqueInput
    /**
     * In case the User found by the `where` argument doesn't exist, create a new User with this data.
     */
    create: XOR<UserCreateInput, UserUncheckedCreateInput>
    /**
     * In case the User was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserUpdateInput, UserUncheckedUpdateInput>
  }

  /**
   * User delete
   */
  export type UserDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
    /**
     * Filter which User to delete.
     */
    where: UserWhereUniqueInput
  }

  /**
   * User deleteMany
   */
  export type UserDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Users to delete
     */
    where?: UserWhereInput
  }

  /**
   * User findRaw
   */
  export type UserFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User aggregateRaw
   */
  export type UserAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * User.attributes
   */
  export type User$attributesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    where?: UserAttributeWhereInput
    orderBy?: UserAttributeOrderByWithRelationInput | UserAttributeOrderByWithRelationInput[]
    cursor?: UserAttributeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAttributeScalarFieldEnum | UserAttributeScalarFieldEnum[]
  }

  /**
   * User.dimensionInputs
   */
  export type User$dimensionInputsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    where?: DimensionInputWhereInput
    orderBy?: DimensionInputOrderByWithRelationInput | DimensionInputOrderByWithRelationInput[]
    cursor?: DimensionInputWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DimensionInputScalarFieldEnum | DimensionInputScalarFieldEnum[]
  }

  /**
   * User.lifeStates
   */
  export type User$lifeStatesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    where?: LifeStateWhereInput
    orderBy?: LifeStateOrderByWithRelationInput | LifeStateOrderByWithRelationInput[]
    cursor?: LifeStateWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LifeStateScalarFieldEnum | LifeStateScalarFieldEnum[]
  }

  /**
   * User.lifeEvents
   */
  export type User$lifeEventsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    where?: LifeEventWhereInput
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    cursor?: LifeEventWhereUniqueInput
    take?: number
    skip?: number
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * User.goals
   */
  export type User$goalsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    where?: GoalWhereInput
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    cursor?: GoalWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GoalScalarFieldEnum | GoalScalarFieldEnum[]
  }

  /**
   * User.chatSessions
   */
  export type User$chatSessionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    cursor?: ChatSessionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * User without action
   */
  export type UserDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the User
     */
    select?: UserSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserInclude<ExtArgs> | null
  }


  /**
   * Model Dimension
   */

  export type AggregateDimension = {
    _count: DimensionCountAggregateOutputType | null
    _avg: DimensionAvgAggregateOutputType | null
    _sum: DimensionSumAggregateOutputType | null
    _min: DimensionMinAggregateOutputType | null
    _max: DimensionMaxAggregateOutputType | null
  }

  export type DimensionAvgAggregateOutputType = {
    sortOrder: number | null
  }

  export type DimensionSumAggregateOutputType = {
    sortOrder: number | null
  }

  export type DimensionMinAggregateOutputType = {
    id: string | null
    name: string | null
    label: string | null
    category: string | null
    description: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DimensionMaxAggregateOutputType = {
    id: string | null
    name: string | null
    label: string | null
    category: string | null
    description: string | null
    sortOrder: number | null
    isActive: boolean | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type DimensionCountAggregateOutputType = {
    id: number
    name: number
    label: number
    category: number
    description: number
    sortOrder: number
    isActive: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type DimensionAvgAggregateInputType = {
    sortOrder?: true
  }

  export type DimensionSumAggregateInputType = {
    sortOrder?: true
  }

  export type DimensionMinAggregateInputType = {
    id?: true
    name?: true
    label?: true
    category?: true
    description?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DimensionMaxAggregateInputType = {
    id?: true
    name?: true
    label?: true
    category?: true
    description?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
  }

  export type DimensionCountAggregateInputType = {
    id?: true
    name?: true
    label?: true
    category?: true
    description?: true
    sortOrder?: true
    isActive?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type DimensionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dimension to aggregate.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Dimensions
    **/
    _count?: true | DimensionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: DimensionAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: DimensionSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DimensionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DimensionMaxAggregateInputType
  }

  export type GetDimensionAggregateType<T extends DimensionAggregateArgs> = {
        [P in keyof T & keyof AggregateDimension]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDimension[P]>
      : GetScalarType<T[P], AggregateDimension[P]>
  }




  export type DimensionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DimensionWhereInput
    orderBy?: DimensionOrderByWithAggregationInput | DimensionOrderByWithAggregationInput[]
    by: DimensionScalarFieldEnum[] | DimensionScalarFieldEnum
    having?: DimensionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DimensionCountAggregateInputType | true
    _avg?: DimensionAvgAggregateInputType
    _sum?: DimensionSumAggregateInputType
    _min?: DimensionMinAggregateInputType
    _max?: DimensionMaxAggregateInputType
  }

  export type DimensionGroupByOutputType = {
    id: string
    name: string
    label: string
    category: string
    description: string | null
    sortOrder: number
    isActive: boolean
    createdAt: Date
    updatedAt: Date
    _count: DimensionCountAggregateOutputType | null
    _avg: DimensionAvgAggregateOutputType | null
    _sum: DimensionSumAggregateOutputType | null
    _min: DimensionMinAggregateOutputType | null
    _max: DimensionMaxAggregateOutputType | null
  }

  type GetDimensionGroupByPayload<T extends DimensionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DimensionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DimensionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DimensionGroupByOutputType[P]>
            : GetScalarType<T[P], DimensionGroupByOutputType[P]>
        }
      >
    >


  export type DimensionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    name?: boolean
    label?: boolean
    category?: boolean
    description?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    attributes?: boolean | Dimension$attributesArgs<ExtArgs>
    dimensionInputs?: boolean | Dimension$dimensionInputsArgs<ExtArgs>
    _count?: boolean | DimensionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dimension"]>


  export type DimensionSelectScalar = {
    id?: boolean
    name?: boolean
    label?: boolean
    category?: boolean
    description?: boolean
    sortOrder?: boolean
    isActive?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type DimensionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    attributes?: boolean | Dimension$attributesArgs<ExtArgs>
    dimensionInputs?: boolean | Dimension$dimensionInputsArgs<ExtArgs>
    _count?: boolean | DimensionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $DimensionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Dimension"
    objects: {
      attributes: Prisma.$UserAttributePayload<ExtArgs>[]
      dimensionInputs: Prisma.$DimensionInputPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      name: string
      label: string
      category: string
      description: string | null
      sortOrder: number
      isActive: boolean
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["dimension"]>
    composites: {}
  }

  type DimensionGetPayload<S extends boolean | null | undefined | DimensionDefaultArgs> = $Result.GetResult<Prisma.$DimensionPayload, S>

  type DimensionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DimensionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DimensionCountAggregateInputType | true
    }

  export interface DimensionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Dimension'], meta: { name: 'Dimension' } }
    /**
     * Find zero or one Dimension that matches the filter.
     * @param {DimensionFindUniqueArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DimensionFindUniqueArgs>(args: SelectSubset<T, DimensionFindUniqueArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Dimension that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DimensionFindUniqueOrThrowArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DimensionFindUniqueOrThrowArgs>(args: SelectSubset<T, DimensionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Dimension that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionFindFirstArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DimensionFindFirstArgs>(args?: SelectSubset<T, DimensionFindFirstArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Dimension that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionFindFirstOrThrowArgs} args - Arguments to find a Dimension
     * @example
     * // Get one Dimension
     * const dimension = await prisma.dimension.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DimensionFindFirstOrThrowArgs>(args?: SelectSubset<T, DimensionFindFirstOrThrowArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Dimensions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Dimensions
     * const dimensions = await prisma.dimension.findMany()
     * 
     * // Get first 10 Dimensions
     * const dimensions = await prisma.dimension.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dimensionWithIdOnly = await prisma.dimension.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DimensionFindManyArgs>(args?: SelectSubset<T, DimensionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Dimension.
     * @param {DimensionCreateArgs} args - Arguments to create a Dimension.
     * @example
     * // Create one Dimension
     * const Dimension = await prisma.dimension.create({
     *   data: {
     *     // ... data to create a Dimension
     *   }
     * })
     * 
     */
    create<T extends DimensionCreateArgs>(args: SelectSubset<T, DimensionCreateArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Dimensions.
     * @param {DimensionCreateManyArgs} args - Arguments to create many Dimensions.
     * @example
     * // Create many Dimensions
     * const dimension = await prisma.dimension.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DimensionCreateManyArgs>(args?: SelectSubset<T, DimensionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Dimension.
     * @param {DimensionDeleteArgs} args - Arguments to delete one Dimension.
     * @example
     * // Delete one Dimension
     * const Dimension = await prisma.dimension.delete({
     *   where: {
     *     // ... filter to delete one Dimension
     *   }
     * })
     * 
     */
    delete<T extends DimensionDeleteArgs>(args: SelectSubset<T, DimensionDeleteArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Dimension.
     * @param {DimensionUpdateArgs} args - Arguments to update one Dimension.
     * @example
     * // Update one Dimension
     * const dimension = await prisma.dimension.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DimensionUpdateArgs>(args: SelectSubset<T, DimensionUpdateArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Dimensions.
     * @param {DimensionDeleteManyArgs} args - Arguments to filter Dimensions to delete.
     * @example
     * // Delete a few Dimensions
     * const { count } = await prisma.dimension.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DimensionDeleteManyArgs>(args?: SelectSubset<T, DimensionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Dimensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Dimensions
     * const dimension = await prisma.dimension.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DimensionUpdateManyArgs>(args: SelectSubset<T, DimensionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Dimension.
     * @param {DimensionUpsertArgs} args - Arguments to update or create a Dimension.
     * @example
     * // Update or create a Dimension
     * const dimension = await prisma.dimension.upsert({
     *   create: {
     *     // ... data to create a Dimension
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Dimension we want to update
     *   }
     * })
     */
    upsert<T extends DimensionUpsertArgs>(args: SelectSubset<T, DimensionUpsertArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Dimensions that matches the filter.
     * @param {DimensionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const dimension = await prisma.dimension.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: DimensionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Dimension.
     * @param {DimensionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const dimension = await prisma.dimension.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: DimensionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Dimensions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionCountArgs} args - Arguments to filter Dimensions to count.
     * @example
     * // Count the number of Dimensions
     * const count = await prisma.dimension.count({
     *   where: {
     *     // ... the filter for the Dimensions we want to count
     *   }
     * })
    **/
    count<T extends DimensionCountArgs>(
      args?: Subset<T, DimensionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DimensionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Dimension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DimensionAggregateArgs>(args: Subset<T, DimensionAggregateArgs>): Prisma.PrismaPromise<GetDimensionAggregateType<T>>

    /**
     * Group by Dimension.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DimensionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DimensionGroupByArgs['orderBy'] }
        : { orderBy?: DimensionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DimensionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDimensionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Dimension model
   */
  readonly fields: DimensionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Dimension.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DimensionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    attributes<T extends Dimension$attributesArgs<ExtArgs> = {}>(args?: Subset<T, Dimension$attributesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "findMany"> | Null>
    dimensionInputs<T extends Dimension$dimensionInputsArgs<ExtArgs> = {}>(args?: Subset<T, Dimension$dimensionInputsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Dimension model
   */ 
  interface DimensionFieldRefs {
    readonly id: FieldRef<"Dimension", 'String'>
    readonly name: FieldRef<"Dimension", 'String'>
    readonly label: FieldRef<"Dimension", 'String'>
    readonly category: FieldRef<"Dimension", 'String'>
    readonly description: FieldRef<"Dimension", 'String'>
    readonly sortOrder: FieldRef<"Dimension", 'Int'>
    readonly isActive: FieldRef<"Dimension", 'Boolean'>
    readonly createdAt: FieldRef<"Dimension", 'DateTime'>
    readonly updatedAt: FieldRef<"Dimension", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Dimension findUnique
   */
  export type DimensionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension findUniqueOrThrow
   */
  export type DimensionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension findFirst
   */
  export type DimensionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dimensions.
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dimensions.
     */
    distinct?: DimensionScalarFieldEnum | DimensionScalarFieldEnum[]
  }

  /**
   * Dimension findFirstOrThrow
   */
  export type DimensionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimension to fetch.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Dimensions.
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Dimensions.
     */
    distinct?: DimensionScalarFieldEnum | DimensionScalarFieldEnum[]
  }

  /**
   * Dimension findMany
   */
  export type DimensionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter, which Dimensions to fetch.
     */
    where?: DimensionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Dimensions to fetch.
     */
    orderBy?: DimensionOrderByWithRelationInput | DimensionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Dimensions.
     */
    cursor?: DimensionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Dimensions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Dimensions.
     */
    skip?: number
    distinct?: DimensionScalarFieldEnum | DimensionScalarFieldEnum[]
  }

  /**
   * Dimension create
   */
  export type DimensionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * The data needed to create a Dimension.
     */
    data: XOR<DimensionCreateInput, DimensionUncheckedCreateInput>
  }

  /**
   * Dimension createMany
   */
  export type DimensionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Dimensions.
     */
    data: DimensionCreateManyInput | DimensionCreateManyInput[]
  }

  /**
   * Dimension update
   */
  export type DimensionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * The data needed to update a Dimension.
     */
    data: XOR<DimensionUpdateInput, DimensionUncheckedUpdateInput>
    /**
     * Choose, which Dimension to update.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension updateMany
   */
  export type DimensionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Dimensions.
     */
    data: XOR<DimensionUpdateManyMutationInput, DimensionUncheckedUpdateManyInput>
    /**
     * Filter which Dimensions to update
     */
    where?: DimensionWhereInput
  }

  /**
   * Dimension upsert
   */
  export type DimensionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * The filter to search for the Dimension to update in case it exists.
     */
    where: DimensionWhereUniqueInput
    /**
     * In case the Dimension found by the `where` argument doesn't exist, create a new Dimension with this data.
     */
    create: XOR<DimensionCreateInput, DimensionUncheckedCreateInput>
    /**
     * In case the Dimension was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DimensionUpdateInput, DimensionUncheckedUpdateInput>
  }

  /**
   * Dimension delete
   */
  export type DimensionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
    /**
     * Filter which Dimension to delete.
     */
    where: DimensionWhereUniqueInput
  }

  /**
   * Dimension deleteMany
   */
  export type DimensionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Dimensions to delete
     */
    where?: DimensionWhereInput
  }

  /**
   * Dimension findRaw
   */
  export type DimensionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Dimension aggregateRaw
   */
  export type DimensionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Dimension.attributes
   */
  export type Dimension$attributesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    where?: UserAttributeWhereInput
    orderBy?: UserAttributeOrderByWithRelationInput | UserAttributeOrderByWithRelationInput[]
    cursor?: UserAttributeWhereUniqueInput
    take?: number
    skip?: number
    distinct?: UserAttributeScalarFieldEnum | UserAttributeScalarFieldEnum[]
  }

  /**
   * Dimension.dimensionInputs
   */
  export type Dimension$dimensionInputsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    where?: DimensionInputWhereInput
    orderBy?: DimensionInputOrderByWithRelationInput | DimensionInputOrderByWithRelationInput[]
    cursor?: DimensionInputWhereUniqueInput
    take?: number
    skip?: number
    distinct?: DimensionInputScalarFieldEnum | DimensionInputScalarFieldEnum[]
  }

  /**
   * Dimension without action
   */
  export type DimensionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Dimension
     */
    select?: DimensionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInclude<ExtArgs> | null
  }


  /**
   * Model UserAttribute
   */

  export type AggregateUserAttribute = {
    _count: UserAttributeCountAggregateOutputType | null
    _min: UserAttributeMinAggregateOutputType | null
    _max: UserAttributeMaxAggregateOutputType | null
  }

  export type UserAttributeMinAggregateOutputType = {
    id: string | null
    userId: string | null
    dimensionId: string | null
    name: string | null
    category: string | null
    createdAt: Date | null
  }

  export type UserAttributeMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    dimensionId: string | null
    name: string | null
    category: string | null
    createdAt: Date | null
  }

  export type UserAttributeCountAggregateOutputType = {
    id: number
    userId: number
    dimensionId: number
    name: number
    category: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type UserAttributeMinAggregateInputType = {
    id?: true
    userId?: true
    dimensionId?: true
    name?: true
    category?: true
    createdAt?: true
  }

  export type UserAttributeMaxAggregateInputType = {
    id?: true
    userId?: true
    dimensionId?: true
    name?: true
    category?: true
    createdAt?: true
  }

  export type UserAttributeCountAggregateInputType = {
    id?: true
    userId?: true
    dimensionId?: true
    name?: true
    category?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type UserAttributeAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAttribute to aggregate.
     */
    where?: UserAttributeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAttributes to fetch.
     */
    orderBy?: UserAttributeOrderByWithRelationInput | UserAttributeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: UserAttributeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAttributes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAttributes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned UserAttributes
    **/
    _count?: true | UserAttributeCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: UserAttributeMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: UserAttributeMaxAggregateInputType
  }

  export type GetUserAttributeAggregateType<T extends UserAttributeAggregateArgs> = {
        [P in keyof T & keyof AggregateUserAttribute]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateUserAttribute[P]>
      : GetScalarType<T[P], AggregateUserAttribute[P]>
  }




  export type UserAttributeGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: UserAttributeWhereInput
    orderBy?: UserAttributeOrderByWithAggregationInput | UserAttributeOrderByWithAggregationInput[]
    by: UserAttributeScalarFieldEnum[] | UserAttributeScalarFieldEnum
    having?: UserAttributeScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: UserAttributeCountAggregateInputType | true
    _min?: UserAttributeMinAggregateInputType
    _max?: UserAttributeMaxAggregateInputType
  }

  export type UserAttributeGroupByOutputType = {
    id: string
    userId: string
    dimensionId: string
    name: string
    category: string
    metadata: JsonValue | null
    createdAt: Date
    _count: UserAttributeCountAggregateOutputType | null
    _min: UserAttributeMinAggregateOutputType | null
    _max: UserAttributeMaxAggregateOutputType | null
  }

  type GetUserAttributeGroupByPayload<T extends UserAttributeGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<UserAttributeGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof UserAttributeGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], UserAttributeGroupByOutputType[P]>
            : GetScalarType<T[P], UserAttributeGroupByOutputType[P]>
        }
      >
    >


  export type UserAttributeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    dimensionId?: boolean
    name?: boolean
    category?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    dimension?: boolean | DimensionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["userAttribute"]>


  export type UserAttributeSelectScalar = {
    id?: boolean
    userId?: boolean
    dimensionId?: boolean
    name?: boolean
    category?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type UserAttributeInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    dimension?: boolean | DimensionDefaultArgs<ExtArgs>
  }

  export type $UserAttributePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "UserAttribute"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      dimension: Prisma.$DimensionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      dimensionId: string
      name: string
      category: string
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["userAttribute"]>
    composites: {}
  }

  type UserAttributeGetPayload<S extends boolean | null | undefined | UserAttributeDefaultArgs> = $Result.GetResult<Prisma.$UserAttributePayload, S>

  type UserAttributeCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<UserAttributeFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: UserAttributeCountAggregateInputType | true
    }

  export interface UserAttributeDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['UserAttribute'], meta: { name: 'UserAttribute' } }
    /**
     * Find zero or one UserAttribute that matches the filter.
     * @param {UserAttributeFindUniqueArgs} args - Arguments to find a UserAttribute
     * @example
     * // Get one UserAttribute
     * const userAttribute = await prisma.userAttribute.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends UserAttributeFindUniqueArgs>(args: SelectSubset<T, UserAttributeFindUniqueArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one UserAttribute that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {UserAttributeFindUniqueOrThrowArgs} args - Arguments to find a UserAttribute
     * @example
     * // Get one UserAttribute
     * const userAttribute = await prisma.userAttribute.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends UserAttributeFindUniqueOrThrowArgs>(args: SelectSubset<T, UserAttributeFindUniqueOrThrowArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first UserAttribute that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAttributeFindFirstArgs} args - Arguments to find a UserAttribute
     * @example
     * // Get one UserAttribute
     * const userAttribute = await prisma.userAttribute.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends UserAttributeFindFirstArgs>(args?: SelectSubset<T, UserAttributeFindFirstArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first UserAttribute that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAttributeFindFirstOrThrowArgs} args - Arguments to find a UserAttribute
     * @example
     * // Get one UserAttribute
     * const userAttribute = await prisma.userAttribute.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends UserAttributeFindFirstOrThrowArgs>(args?: SelectSubset<T, UserAttributeFindFirstOrThrowArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more UserAttributes that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAttributeFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all UserAttributes
     * const userAttributes = await prisma.userAttribute.findMany()
     * 
     * // Get first 10 UserAttributes
     * const userAttributes = await prisma.userAttribute.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const userAttributeWithIdOnly = await prisma.userAttribute.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends UserAttributeFindManyArgs>(args?: SelectSubset<T, UserAttributeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a UserAttribute.
     * @param {UserAttributeCreateArgs} args - Arguments to create a UserAttribute.
     * @example
     * // Create one UserAttribute
     * const UserAttribute = await prisma.userAttribute.create({
     *   data: {
     *     // ... data to create a UserAttribute
     *   }
     * })
     * 
     */
    create<T extends UserAttributeCreateArgs>(args: SelectSubset<T, UserAttributeCreateArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many UserAttributes.
     * @param {UserAttributeCreateManyArgs} args - Arguments to create many UserAttributes.
     * @example
     * // Create many UserAttributes
     * const userAttribute = await prisma.userAttribute.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends UserAttributeCreateManyArgs>(args?: SelectSubset<T, UserAttributeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a UserAttribute.
     * @param {UserAttributeDeleteArgs} args - Arguments to delete one UserAttribute.
     * @example
     * // Delete one UserAttribute
     * const UserAttribute = await prisma.userAttribute.delete({
     *   where: {
     *     // ... filter to delete one UserAttribute
     *   }
     * })
     * 
     */
    delete<T extends UserAttributeDeleteArgs>(args: SelectSubset<T, UserAttributeDeleteArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one UserAttribute.
     * @param {UserAttributeUpdateArgs} args - Arguments to update one UserAttribute.
     * @example
     * // Update one UserAttribute
     * const userAttribute = await prisma.userAttribute.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends UserAttributeUpdateArgs>(args: SelectSubset<T, UserAttributeUpdateArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more UserAttributes.
     * @param {UserAttributeDeleteManyArgs} args - Arguments to filter UserAttributes to delete.
     * @example
     * // Delete a few UserAttributes
     * const { count } = await prisma.userAttribute.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends UserAttributeDeleteManyArgs>(args?: SelectSubset<T, UserAttributeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more UserAttributes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAttributeUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many UserAttributes
     * const userAttribute = await prisma.userAttribute.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends UserAttributeUpdateManyArgs>(args: SelectSubset<T, UserAttributeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one UserAttribute.
     * @param {UserAttributeUpsertArgs} args - Arguments to update or create a UserAttribute.
     * @example
     * // Update or create a UserAttribute
     * const userAttribute = await prisma.userAttribute.upsert({
     *   create: {
     *     // ... data to create a UserAttribute
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the UserAttribute we want to update
     *   }
     * })
     */
    upsert<T extends UserAttributeUpsertArgs>(args: SelectSubset<T, UserAttributeUpsertArgs<ExtArgs>>): Prisma__UserAttributeClient<$Result.GetResult<Prisma.$UserAttributePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more UserAttributes that matches the filter.
     * @param {UserAttributeFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const userAttribute = await prisma.userAttribute.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: UserAttributeFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a UserAttribute.
     * @param {UserAttributeAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const userAttribute = await prisma.userAttribute.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: UserAttributeAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of UserAttributes.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAttributeCountArgs} args - Arguments to filter UserAttributes to count.
     * @example
     * // Count the number of UserAttributes
     * const count = await prisma.userAttribute.count({
     *   where: {
     *     // ... the filter for the UserAttributes we want to count
     *   }
     * })
    **/
    count<T extends UserAttributeCountArgs>(
      args?: Subset<T, UserAttributeCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], UserAttributeCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a UserAttribute.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAttributeAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends UserAttributeAggregateArgs>(args: Subset<T, UserAttributeAggregateArgs>): Prisma.PrismaPromise<GetUserAttributeAggregateType<T>>

    /**
     * Group by UserAttribute.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {UserAttributeGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends UserAttributeGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: UserAttributeGroupByArgs['orderBy'] }
        : { orderBy?: UserAttributeGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, UserAttributeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetUserAttributeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the UserAttribute model
   */
  readonly fields: UserAttributeFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for UserAttribute.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__UserAttributeClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    dimension<T extends DimensionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DimensionDefaultArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the UserAttribute model
   */ 
  interface UserAttributeFieldRefs {
    readonly id: FieldRef<"UserAttribute", 'String'>
    readonly userId: FieldRef<"UserAttribute", 'String'>
    readonly dimensionId: FieldRef<"UserAttribute", 'String'>
    readonly name: FieldRef<"UserAttribute", 'String'>
    readonly category: FieldRef<"UserAttribute", 'String'>
    readonly metadata: FieldRef<"UserAttribute", 'Json'>
    readonly createdAt: FieldRef<"UserAttribute", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * UserAttribute findUnique
   */
  export type UserAttributeFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * Filter, which UserAttribute to fetch.
     */
    where: UserAttributeWhereUniqueInput
  }

  /**
   * UserAttribute findUniqueOrThrow
   */
  export type UserAttributeFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * Filter, which UserAttribute to fetch.
     */
    where: UserAttributeWhereUniqueInput
  }

  /**
   * UserAttribute findFirst
   */
  export type UserAttributeFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * Filter, which UserAttribute to fetch.
     */
    where?: UserAttributeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAttributes to fetch.
     */
    orderBy?: UserAttributeOrderByWithRelationInput | UserAttributeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAttributes.
     */
    cursor?: UserAttributeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAttributes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAttributes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAttributes.
     */
    distinct?: UserAttributeScalarFieldEnum | UserAttributeScalarFieldEnum[]
  }

  /**
   * UserAttribute findFirstOrThrow
   */
  export type UserAttributeFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * Filter, which UserAttribute to fetch.
     */
    where?: UserAttributeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAttributes to fetch.
     */
    orderBy?: UserAttributeOrderByWithRelationInput | UserAttributeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for UserAttributes.
     */
    cursor?: UserAttributeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAttributes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAttributes.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of UserAttributes.
     */
    distinct?: UserAttributeScalarFieldEnum | UserAttributeScalarFieldEnum[]
  }

  /**
   * UserAttribute findMany
   */
  export type UserAttributeFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * Filter, which UserAttributes to fetch.
     */
    where?: UserAttributeWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of UserAttributes to fetch.
     */
    orderBy?: UserAttributeOrderByWithRelationInput | UserAttributeOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing UserAttributes.
     */
    cursor?: UserAttributeWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` UserAttributes from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` UserAttributes.
     */
    skip?: number
    distinct?: UserAttributeScalarFieldEnum | UserAttributeScalarFieldEnum[]
  }

  /**
   * UserAttribute create
   */
  export type UserAttributeCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * The data needed to create a UserAttribute.
     */
    data: XOR<UserAttributeCreateInput, UserAttributeUncheckedCreateInput>
  }

  /**
   * UserAttribute createMany
   */
  export type UserAttributeCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many UserAttributes.
     */
    data: UserAttributeCreateManyInput | UserAttributeCreateManyInput[]
  }

  /**
   * UserAttribute update
   */
  export type UserAttributeUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * The data needed to update a UserAttribute.
     */
    data: XOR<UserAttributeUpdateInput, UserAttributeUncheckedUpdateInput>
    /**
     * Choose, which UserAttribute to update.
     */
    where: UserAttributeWhereUniqueInput
  }

  /**
   * UserAttribute updateMany
   */
  export type UserAttributeUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update UserAttributes.
     */
    data: XOR<UserAttributeUpdateManyMutationInput, UserAttributeUncheckedUpdateManyInput>
    /**
     * Filter which UserAttributes to update
     */
    where?: UserAttributeWhereInput
  }

  /**
   * UserAttribute upsert
   */
  export type UserAttributeUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * The filter to search for the UserAttribute to update in case it exists.
     */
    where: UserAttributeWhereUniqueInput
    /**
     * In case the UserAttribute found by the `where` argument doesn't exist, create a new UserAttribute with this data.
     */
    create: XOR<UserAttributeCreateInput, UserAttributeUncheckedCreateInput>
    /**
     * In case the UserAttribute was found with the provided `where` argument, update it with this data.
     */
    update: XOR<UserAttributeUpdateInput, UserAttributeUncheckedUpdateInput>
  }

  /**
   * UserAttribute delete
   */
  export type UserAttributeDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
    /**
     * Filter which UserAttribute to delete.
     */
    where: UserAttributeWhereUniqueInput
  }

  /**
   * UserAttribute deleteMany
   */
  export type UserAttributeDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which UserAttributes to delete
     */
    where?: UserAttributeWhereInput
  }

  /**
   * UserAttribute findRaw
   */
  export type UserAttributeFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UserAttribute aggregateRaw
   */
  export type UserAttributeAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * UserAttribute without action
   */
  export type UserAttributeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the UserAttribute
     */
    select?: UserAttributeSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: UserAttributeInclude<ExtArgs> | null
  }


  /**
   * Model DimensionInput
   */

  export type AggregateDimensionInput = {
    _count: DimensionInputCountAggregateOutputType | null
    _min: DimensionInputMinAggregateOutputType | null
    _max: DimensionInputMaxAggregateOutputType | null
  }

  export type DimensionInputMinAggregateOutputType = {
    id: string | null
    userId: string | null
    dimensionId: string | null
    inputType: string | null
    subType: string | null
    source: string | null
    createdAt: Date | null
  }

  export type DimensionInputMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    dimensionId: string | null
    inputType: string | null
    subType: string | null
    source: string | null
    createdAt: Date | null
  }

  export type DimensionInputCountAggregateOutputType = {
    id: number
    userId: number
    dimensionId: number
    inputType: number
    subType: number
    valueJson: number
    source: number
    createdAt: number
    _all: number
  }


  export type DimensionInputMinAggregateInputType = {
    id?: true
    userId?: true
    dimensionId?: true
    inputType?: true
    subType?: true
    source?: true
    createdAt?: true
  }

  export type DimensionInputMaxAggregateInputType = {
    id?: true
    userId?: true
    dimensionId?: true
    inputType?: true
    subType?: true
    source?: true
    createdAt?: true
  }

  export type DimensionInputCountAggregateInputType = {
    id?: true
    userId?: true
    dimensionId?: true
    inputType?: true
    subType?: true
    valueJson?: true
    source?: true
    createdAt?: true
    _all?: true
  }

  export type DimensionInputAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DimensionInput to aggregate.
     */
    where?: DimensionInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DimensionInputs to fetch.
     */
    orderBy?: DimensionInputOrderByWithRelationInput | DimensionInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: DimensionInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DimensionInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DimensionInputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned DimensionInputs
    **/
    _count?: true | DimensionInputCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: DimensionInputMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: DimensionInputMaxAggregateInputType
  }

  export type GetDimensionInputAggregateType<T extends DimensionInputAggregateArgs> = {
        [P in keyof T & keyof AggregateDimensionInput]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateDimensionInput[P]>
      : GetScalarType<T[P], AggregateDimensionInput[P]>
  }




  export type DimensionInputGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: DimensionInputWhereInput
    orderBy?: DimensionInputOrderByWithAggregationInput | DimensionInputOrderByWithAggregationInput[]
    by: DimensionInputScalarFieldEnum[] | DimensionInputScalarFieldEnum
    having?: DimensionInputScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: DimensionInputCountAggregateInputType | true
    _min?: DimensionInputMinAggregateInputType
    _max?: DimensionInputMaxAggregateInputType
  }

  export type DimensionInputGroupByOutputType = {
    id: string
    userId: string
    dimensionId: string
    inputType: string
    subType: string | null
    valueJson: JsonValue
    source: string
    createdAt: Date
    _count: DimensionInputCountAggregateOutputType | null
    _min: DimensionInputMinAggregateOutputType | null
    _max: DimensionInputMaxAggregateOutputType | null
  }

  type GetDimensionInputGroupByPayload<T extends DimensionInputGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<DimensionInputGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof DimensionInputGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], DimensionInputGroupByOutputType[P]>
            : GetScalarType<T[P], DimensionInputGroupByOutputType[P]>
        }
      >
    >


  export type DimensionInputSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    dimensionId?: boolean
    inputType?: boolean
    subType?: boolean
    valueJson?: boolean
    source?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    dimension?: boolean | DimensionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["dimensionInput"]>


  export type DimensionInputSelectScalar = {
    id?: boolean
    userId?: boolean
    dimensionId?: boolean
    inputType?: boolean
    subType?: boolean
    valueJson?: boolean
    source?: boolean
    createdAt?: boolean
  }

  export type DimensionInputInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    dimension?: boolean | DimensionDefaultArgs<ExtArgs>
  }

  export type $DimensionInputPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "DimensionInput"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      dimension: Prisma.$DimensionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      dimensionId: string
      inputType: string
      subType: string | null
      valueJson: Prisma.JsonValue
      source: string
      createdAt: Date
    }, ExtArgs["result"]["dimensionInput"]>
    composites: {}
  }

  type DimensionInputGetPayload<S extends boolean | null | undefined | DimensionInputDefaultArgs> = $Result.GetResult<Prisma.$DimensionInputPayload, S>

  type DimensionInputCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<DimensionInputFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: DimensionInputCountAggregateInputType | true
    }

  export interface DimensionInputDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['DimensionInput'], meta: { name: 'DimensionInput' } }
    /**
     * Find zero or one DimensionInput that matches the filter.
     * @param {DimensionInputFindUniqueArgs} args - Arguments to find a DimensionInput
     * @example
     * // Get one DimensionInput
     * const dimensionInput = await prisma.dimensionInput.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends DimensionInputFindUniqueArgs>(args: SelectSubset<T, DimensionInputFindUniqueArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one DimensionInput that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {DimensionInputFindUniqueOrThrowArgs} args - Arguments to find a DimensionInput
     * @example
     * // Get one DimensionInput
     * const dimensionInput = await prisma.dimensionInput.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends DimensionInputFindUniqueOrThrowArgs>(args: SelectSubset<T, DimensionInputFindUniqueOrThrowArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first DimensionInput that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionInputFindFirstArgs} args - Arguments to find a DimensionInput
     * @example
     * // Get one DimensionInput
     * const dimensionInput = await prisma.dimensionInput.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends DimensionInputFindFirstArgs>(args?: SelectSubset<T, DimensionInputFindFirstArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first DimensionInput that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionInputFindFirstOrThrowArgs} args - Arguments to find a DimensionInput
     * @example
     * // Get one DimensionInput
     * const dimensionInput = await prisma.dimensionInput.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends DimensionInputFindFirstOrThrowArgs>(args?: SelectSubset<T, DimensionInputFindFirstOrThrowArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more DimensionInputs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionInputFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all DimensionInputs
     * const dimensionInputs = await prisma.dimensionInput.findMany()
     * 
     * // Get first 10 DimensionInputs
     * const dimensionInputs = await prisma.dimensionInput.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const dimensionInputWithIdOnly = await prisma.dimensionInput.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends DimensionInputFindManyArgs>(args?: SelectSubset<T, DimensionInputFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a DimensionInput.
     * @param {DimensionInputCreateArgs} args - Arguments to create a DimensionInput.
     * @example
     * // Create one DimensionInput
     * const DimensionInput = await prisma.dimensionInput.create({
     *   data: {
     *     // ... data to create a DimensionInput
     *   }
     * })
     * 
     */
    create<T extends DimensionInputCreateArgs>(args: SelectSubset<T, DimensionInputCreateArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many DimensionInputs.
     * @param {DimensionInputCreateManyArgs} args - Arguments to create many DimensionInputs.
     * @example
     * // Create many DimensionInputs
     * const dimensionInput = await prisma.dimensionInput.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends DimensionInputCreateManyArgs>(args?: SelectSubset<T, DimensionInputCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a DimensionInput.
     * @param {DimensionInputDeleteArgs} args - Arguments to delete one DimensionInput.
     * @example
     * // Delete one DimensionInput
     * const DimensionInput = await prisma.dimensionInput.delete({
     *   where: {
     *     // ... filter to delete one DimensionInput
     *   }
     * })
     * 
     */
    delete<T extends DimensionInputDeleteArgs>(args: SelectSubset<T, DimensionInputDeleteArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one DimensionInput.
     * @param {DimensionInputUpdateArgs} args - Arguments to update one DimensionInput.
     * @example
     * // Update one DimensionInput
     * const dimensionInput = await prisma.dimensionInput.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends DimensionInputUpdateArgs>(args: SelectSubset<T, DimensionInputUpdateArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more DimensionInputs.
     * @param {DimensionInputDeleteManyArgs} args - Arguments to filter DimensionInputs to delete.
     * @example
     * // Delete a few DimensionInputs
     * const { count } = await prisma.dimensionInput.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends DimensionInputDeleteManyArgs>(args?: SelectSubset<T, DimensionInputDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more DimensionInputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionInputUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many DimensionInputs
     * const dimensionInput = await prisma.dimensionInput.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends DimensionInputUpdateManyArgs>(args: SelectSubset<T, DimensionInputUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one DimensionInput.
     * @param {DimensionInputUpsertArgs} args - Arguments to update or create a DimensionInput.
     * @example
     * // Update or create a DimensionInput
     * const dimensionInput = await prisma.dimensionInput.upsert({
     *   create: {
     *     // ... data to create a DimensionInput
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the DimensionInput we want to update
     *   }
     * })
     */
    upsert<T extends DimensionInputUpsertArgs>(args: SelectSubset<T, DimensionInputUpsertArgs<ExtArgs>>): Prisma__DimensionInputClient<$Result.GetResult<Prisma.$DimensionInputPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more DimensionInputs that matches the filter.
     * @param {DimensionInputFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const dimensionInput = await prisma.dimensionInput.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: DimensionInputFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a DimensionInput.
     * @param {DimensionInputAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const dimensionInput = await prisma.dimensionInput.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: DimensionInputAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of DimensionInputs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionInputCountArgs} args - Arguments to filter DimensionInputs to count.
     * @example
     * // Count the number of DimensionInputs
     * const count = await prisma.dimensionInput.count({
     *   where: {
     *     // ... the filter for the DimensionInputs we want to count
     *   }
     * })
    **/
    count<T extends DimensionInputCountArgs>(
      args?: Subset<T, DimensionInputCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], DimensionInputCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a DimensionInput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionInputAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends DimensionInputAggregateArgs>(args: Subset<T, DimensionInputAggregateArgs>): Prisma.PrismaPromise<GetDimensionInputAggregateType<T>>

    /**
     * Group by DimensionInput.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {DimensionInputGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends DimensionInputGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: DimensionInputGroupByArgs['orderBy'] }
        : { orderBy?: DimensionInputGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, DimensionInputGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDimensionInputGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the DimensionInput model
   */
  readonly fields: DimensionInputFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for DimensionInput.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__DimensionInputClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    dimension<T extends DimensionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, DimensionDefaultArgs<ExtArgs>>): Prisma__DimensionClient<$Result.GetResult<Prisma.$DimensionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the DimensionInput model
   */ 
  interface DimensionInputFieldRefs {
    readonly id: FieldRef<"DimensionInput", 'String'>
    readonly userId: FieldRef<"DimensionInput", 'String'>
    readonly dimensionId: FieldRef<"DimensionInput", 'String'>
    readonly inputType: FieldRef<"DimensionInput", 'String'>
    readonly subType: FieldRef<"DimensionInput", 'String'>
    readonly valueJson: FieldRef<"DimensionInput", 'Json'>
    readonly source: FieldRef<"DimensionInput", 'String'>
    readonly createdAt: FieldRef<"DimensionInput", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * DimensionInput findUnique
   */
  export type DimensionInputFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * Filter, which DimensionInput to fetch.
     */
    where: DimensionInputWhereUniqueInput
  }

  /**
   * DimensionInput findUniqueOrThrow
   */
  export type DimensionInputFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * Filter, which DimensionInput to fetch.
     */
    where: DimensionInputWhereUniqueInput
  }

  /**
   * DimensionInput findFirst
   */
  export type DimensionInputFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * Filter, which DimensionInput to fetch.
     */
    where?: DimensionInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DimensionInputs to fetch.
     */
    orderBy?: DimensionInputOrderByWithRelationInput | DimensionInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DimensionInputs.
     */
    cursor?: DimensionInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DimensionInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DimensionInputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DimensionInputs.
     */
    distinct?: DimensionInputScalarFieldEnum | DimensionInputScalarFieldEnum[]
  }

  /**
   * DimensionInput findFirstOrThrow
   */
  export type DimensionInputFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * Filter, which DimensionInput to fetch.
     */
    where?: DimensionInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DimensionInputs to fetch.
     */
    orderBy?: DimensionInputOrderByWithRelationInput | DimensionInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for DimensionInputs.
     */
    cursor?: DimensionInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DimensionInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DimensionInputs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of DimensionInputs.
     */
    distinct?: DimensionInputScalarFieldEnum | DimensionInputScalarFieldEnum[]
  }

  /**
   * DimensionInput findMany
   */
  export type DimensionInputFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * Filter, which DimensionInputs to fetch.
     */
    where?: DimensionInputWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of DimensionInputs to fetch.
     */
    orderBy?: DimensionInputOrderByWithRelationInput | DimensionInputOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing DimensionInputs.
     */
    cursor?: DimensionInputWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` DimensionInputs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` DimensionInputs.
     */
    skip?: number
    distinct?: DimensionInputScalarFieldEnum | DimensionInputScalarFieldEnum[]
  }

  /**
   * DimensionInput create
   */
  export type DimensionInputCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * The data needed to create a DimensionInput.
     */
    data: XOR<DimensionInputCreateInput, DimensionInputUncheckedCreateInput>
  }

  /**
   * DimensionInput createMany
   */
  export type DimensionInputCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many DimensionInputs.
     */
    data: DimensionInputCreateManyInput | DimensionInputCreateManyInput[]
  }

  /**
   * DimensionInput update
   */
  export type DimensionInputUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * The data needed to update a DimensionInput.
     */
    data: XOR<DimensionInputUpdateInput, DimensionInputUncheckedUpdateInput>
    /**
     * Choose, which DimensionInput to update.
     */
    where: DimensionInputWhereUniqueInput
  }

  /**
   * DimensionInput updateMany
   */
  export type DimensionInputUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update DimensionInputs.
     */
    data: XOR<DimensionInputUpdateManyMutationInput, DimensionInputUncheckedUpdateManyInput>
    /**
     * Filter which DimensionInputs to update
     */
    where?: DimensionInputWhereInput
  }

  /**
   * DimensionInput upsert
   */
  export type DimensionInputUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * The filter to search for the DimensionInput to update in case it exists.
     */
    where: DimensionInputWhereUniqueInput
    /**
     * In case the DimensionInput found by the `where` argument doesn't exist, create a new DimensionInput with this data.
     */
    create: XOR<DimensionInputCreateInput, DimensionInputUncheckedCreateInput>
    /**
     * In case the DimensionInput was found with the provided `where` argument, update it with this data.
     */
    update: XOR<DimensionInputUpdateInput, DimensionInputUncheckedUpdateInput>
  }

  /**
   * DimensionInput delete
   */
  export type DimensionInputDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
    /**
     * Filter which DimensionInput to delete.
     */
    where: DimensionInputWhereUniqueInput
  }

  /**
   * DimensionInput deleteMany
   */
  export type DimensionInputDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which DimensionInputs to delete
     */
    where?: DimensionInputWhereInput
  }

  /**
   * DimensionInput findRaw
   */
  export type DimensionInputFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * DimensionInput aggregateRaw
   */
  export type DimensionInputAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * DimensionInput without action
   */
  export type DimensionInputDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the DimensionInput
     */
    select?: DimensionInputSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: DimensionInputInclude<ExtArgs> | null
  }


  /**
   * Model LifeState
   */

  export type AggregateLifeState = {
    _count: LifeStateCountAggregateOutputType | null
    _avg: LifeStateAvgAggregateOutputType | null
    _sum: LifeStateSumAggregateOutputType | null
    _min: LifeStateMinAggregateOutputType | null
    _max: LifeStateMaxAggregateOutputType | null
  }

  export type LifeStateAvgAggregateOutputType = {
    lifeScore: number | null
    balanceScore: number | null
    alignmentScore: number | null
    energyIndex: number | null
  }

  export type LifeStateSumAggregateOutputType = {
    lifeScore: number | null
    balanceScore: number | null
    alignmentScore: number | null
    energyIndex: number | null
  }

  export type LifeStateMinAggregateOutputType = {
    id: string | null
    userId: string | null
    lifeScore: number | null
    balanceScore: number | null
    alignmentScore: number | null
    energyIndex: number | null
    timestamp: Date | null
    triggeredBy: string | null
  }

  export type LifeStateMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    lifeScore: number | null
    balanceScore: number | null
    alignmentScore: number | null
    energyIndex: number | null
    timestamp: Date | null
    triggeredBy: string | null
  }

  export type LifeStateCountAggregateOutputType = {
    id: number
    userId: number
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp: number
    triggeredBy: number
    insights: number
    _all: number
  }


  export type LifeStateAvgAggregateInputType = {
    lifeScore?: true
    balanceScore?: true
    alignmentScore?: true
    energyIndex?: true
  }

  export type LifeStateSumAggregateInputType = {
    lifeScore?: true
    balanceScore?: true
    alignmentScore?: true
    energyIndex?: true
  }

  export type LifeStateMinAggregateInputType = {
    id?: true
    userId?: true
    lifeScore?: true
    balanceScore?: true
    alignmentScore?: true
    energyIndex?: true
    timestamp?: true
    triggeredBy?: true
  }

  export type LifeStateMaxAggregateInputType = {
    id?: true
    userId?: true
    lifeScore?: true
    balanceScore?: true
    alignmentScore?: true
    energyIndex?: true
    timestamp?: true
    triggeredBy?: true
  }

  export type LifeStateCountAggregateInputType = {
    id?: true
    userId?: true
    lifeScore?: true
    balanceScore?: true
    alignmentScore?: true
    energyIndex?: true
    timestamp?: true
    triggeredBy?: true
    insights?: true
    _all?: true
  }

  export type LifeStateAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeState to aggregate.
     */
    where?: LifeStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeStates to fetch.
     */
    orderBy?: LifeStateOrderByWithRelationInput | LifeStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LifeStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LifeStates
    **/
    _count?: true | LifeStateCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: LifeStateAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: LifeStateSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LifeStateMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LifeStateMaxAggregateInputType
  }

  export type GetLifeStateAggregateType<T extends LifeStateAggregateArgs> = {
        [P in keyof T & keyof AggregateLifeState]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLifeState[P]>
      : GetScalarType<T[P], AggregateLifeState[P]>
  }




  export type LifeStateGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeStateWhereInput
    orderBy?: LifeStateOrderByWithAggregationInput | LifeStateOrderByWithAggregationInput[]
    by: LifeStateScalarFieldEnum[] | LifeStateScalarFieldEnum
    having?: LifeStateScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LifeStateCountAggregateInputType | true
    _avg?: LifeStateAvgAggregateInputType
    _sum?: LifeStateSumAggregateInputType
    _min?: LifeStateMinAggregateInputType
    _max?: LifeStateMaxAggregateInputType
  }

  export type LifeStateGroupByOutputType = {
    id: string
    userId: string
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp: Date
    triggeredBy: string | null
    insights: JsonValue | null
    _count: LifeStateCountAggregateOutputType | null
    _avg: LifeStateAvgAggregateOutputType | null
    _sum: LifeStateSumAggregateOutputType | null
    _min: LifeStateMinAggregateOutputType | null
    _max: LifeStateMaxAggregateOutputType | null
  }

  type GetLifeStateGroupByPayload<T extends LifeStateGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LifeStateGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LifeStateGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LifeStateGroupByOutputType[P]>
            : GetScalarType<T[P], LifeStateGroupByOutputType[P]>
        }
      >
    >


  export type LifeStateSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    lifeScore?: boolean
    balanceScore?: boolean
    alignmentScore?: boolean
    energyIndex?: boolean
    timestamp?: boolean
    triggeredBy?: boolean
    insights?: boolean
    scores?: boolean | DimensionScoreDefaultArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeState"]>


  export type LifeStateSelectScalar = {
    id?: boolean
    userId?: boolean
    lifeScore?: boolean
    balanceScore?: boolean
    alignmentScore?: boolean
    energyIndex?: boolean
    timestamp?: boolean
    triggeredBy?: boolean
    insights?: boolean
  }

  export type LifeStateInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LifeStatePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LifeState"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      lifeScore: number
      balanceScore: number
      alignmentScore: number
      energyIndex: number
      timestamp: Date
      triggeredBy: string | null
      insights: Prisma.JsonValue | null
    }, ExtArgs["result"]["lifeState"]>
    composites: {
      scores: Prisma.$DimensionScorePayload[]
    }
  }

  type LifeStateGetPayload<S extends boolean | null | undefined | LifeStateDefaultArgs> = $Result.GetResult<Prisma.$LifeStatePayload, S>

  type LifeStateCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LifeStateFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LifeStateCountAggregateInputType | true
    }

  export interface LifeStateDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LifeState'], meta: { name: 'LifeState' } }
    /**
     * Find zero or one LifeState that matches the filter.
     * @param {LifeStateFindUniqueArgs} args - Arguments to find a LifeState
     * @example
     * // Get one LifeState
     * const lifeState = await prisma.lifeState.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LifeStateFindUniqueArgs>(args: SelectSubset<T, LifeStateFindUniqueArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LifeState that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LifeStateFindUniqueOrThrowArgs} args - Arguments to find a LifeState
     * @example
     * // Get one LifeState
     * const lifeState = await prisma.lifeState.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LifeStateFindUniqueOrThrowArgs>(args: SelectSubset<T, LifeStateFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LifeState that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeStateFindFirstArgs} args - Arguments to find a LifeState
     * @example
     * // Get one LifeState
     * const lifeState = await prisma.lifeState.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LifeStateFindFirstArgs>(args?: SelectSubset<T, LifeStateFindFirstArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LifeState that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeStateFindFirstOrThrowArgs} args - Arguments to find a LifeState
     * @example
     * // Get one LifeState
     * const lifeState = await prisma.lifeState.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LifeStateFindFirstOrThrowArgs>(args?: SelectSubset<T, LifeStateFindFirstOrThrowArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LifeStates that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeStateFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LifeStates
     * const lifeStates = await prisma.lifeState.findMany()
     * 
     * // Get first 10 LifeStates
     * const lifeStates = await prisma.lifeState.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lifeStateWithIdOnly = await prisma.lifeState.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LifeStateFindManyArgs>(args?: SelectSubset<T, LifeStateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LifeState.
     * @param {LifeStateCreateArgs} args - Arguments to create a LifeState.
     * @example
     * // Create one LifeState
     * const LifeState = await prisma.lifeState.create({
     *   data: {
     *     // ... data to create a LifeState
     *   }
     * })
     * 
     */
    create<T extends LifeStateCreateArgs>(args: SelectSubset<T, LifeStateCreateArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LifeStates.
     * @param {LifeStateCreateManyArgs} args - Arguments to create many LifeStates.
     * @example
     * // Create many LifeStates
     * const lifeState = await prisma.lifeState.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LifeStateCreateManyArgs>(args?: SelectSubset<T, LifeStateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LifeState.
     * @param {LifeStateDeleteArgs} args - Arguments to delete one LifeState.
     * @example
     * // Delete one LifeState
     * const LifeState = await prisma.lifeState.delete({
     *   where: {
     *     // ... filter to delete one LifeState
     *   }
     * })
     * 
     */
    delete<T extends LifeStateDeleteArgs>(args: SelectSubset<T, LifeStateDeleteArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LifeState.
     * @param {LifeStateUpdateArgs} args - Arguments to update one LifeState.
     * @example
     * // Update one LifeState
     * const lifeState = await prisma.lifeState.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LifeStateUpdateArgs>(args: SelectSubset<T, LifeStateUpdateArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LifeStates.
     * @param {LifeStateDeleteManyArgs} args - Arguments to filter LifeStates to delete.
     * @example
     * // Delete a few LifeStates
     * const { count } = await prisma.lifeState.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LifeStateDeleteManyArgs>(args?: SelectSubset<T, LifeStateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeStateUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LifeStates
     * const lifeState = await prisma.lifeState.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LifeStateUpdateManyArgs>(args: SelectSubset<T, LifeStateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LifeState.
     * @param {LifeStateUpsertArgs} args - Arguments to update or create a LifeState.
     * @example
     * // Update or create a LifeState
     * const lifeState = await prisma.lifeState.upsert({
     *   create: {
     *     // ... data to create a LifeState
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LifeState we want to update
     *   }
     * })
     */
    upsert<T extends LifeStateUpsertArgs>(args: SelectSubset<T, LifeStateUpsertArgs<ExtArgs>>): Prisma__LifeStateClient<$Result.GetResult<Prisma.$LifeStatePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more LifeStates that matches the filter.
     * @param {LifeStateFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const lifeState = await prisma.lifeState.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: LifeStateFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a LifeState.
     * @param {LifeStateAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const lifeState = await prisma.lifeState.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: LifeStateAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of LifeStates.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeStateCountArgs} args - Arguments to filter LifeStates to count.
     * @example
     * // Count the number of LifeStates
     * const count = await prisma.lifeState.count({
     *   where: {
     *     // ... the filter for the LifeStates we want to count
     *   }
     * })
    **/
    count<T extends LifeStateCountArgs>(
      args?: Subset<T, LifeStateCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LifeStateCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LifeState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeStateAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LifeStateAggregateArgs>(args: Subset<T, LifeStateAggregateArgs>): Prisma.PrismaPromise<GetLifeStateAggregateType<T>>

    /**
     * Group by LifeState.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeStateGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LifeStateGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LifeStateGroupByArgs['orderBy'] }
        : { orderBy?: LifeStateGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LifeStateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLifeStateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LifeState model
   */
  readonly fields: LifeStateFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LifeState.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LifeStateClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LifeState model
   */ 
  interface LifeStateFieldRefs {
    readonly id: FieldRef<"LifeState", 'String'>
    readonly userId: FieldRef<"LifeState", 'String'>
    readonly lifeScore: FieldRef<"LifeState", 'Float'>
    readonly balanceScore: FieldRef<"LifeState", 'Float'>
    readonly alignmentScore: FieldRef<"LifeState", 'Float'>
    readonly energyIndex: FieldRef<"LifeState", 'Float'>
    readonly timestamp: FieldRef<"LifeState", 'DateTime'>
    readonly triggeredBy: FieldRef<"LifeState", 'String'>
    readonly insights: FieldRef<"LifeState", 'Json'>
  }
    

  // Custom InputTypes
  /**
   * LifeState findUnique
   */
  export type LifeStateFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * Filter, which LifeState to fetch.
     */
    where: LifeStateWhereUniqueInput
  }

  /**
   * LifeState findUniqueOrThrow
   */
  export type LifeStateFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * Filter, which LifeState to fetch.
     */
    where: LifeStateWhereUniqueInput
  }

  /**
   * LifeState findFirst
   */
  export type LifeStateFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * Filter, which LifeState to fetch.
     */
    where?: LifeStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeStates to fetch.
     */
    orderBy?: LifeStateOrderByWithRelationInput | LifeStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeStates.
     */
    cursor?: LifeStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeStates.
     */
    distinct?: LifeStateScalarFieldEnum | LifeStateScalarFieldEnum[]
  }

  /**
   * LifeState findFirstOrThrow
   */
  export type LifeStateFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * Filter, which LifeState to fetch.
     */
    where?: LifeStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeStates to fetch.
     */
    orderBy?: LifeStateOrderByWithRelationInput | LifeStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeStates.
     */
    cursor?: LifeStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeStates.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeStates.
     */
    distinct?: LifeStateScalarFieldEnum | LifeStateScalarFieldEnum[]
  }

  /**
   * LifeState findMany
   */
  export type LifeStateFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * Filter, which LifeStates to fetch.
     */
    where?: LifeStateWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeStates to fetch.
     */
    orderBy?: LifeStateOrderByWithRelationInput | LifeStateOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LifeStates.
     */
    cursor?: LifeStateWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeStates from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeStates.
     */
    skip?: number
    distinct?: LifeStateScalarFieldEnum | LifeStateScalarFieldEnum[]
  }

  /**
   * LifeState create
   */
  export type LifeStateCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * The data needed to create a LifeState.
     */
    data: XOR<LifeStateCreateInput, LifeStateUncheckedCreateInput>
  }

  /**
   * LifeState createMany
   */
  export type LifeStateCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LifeStates.
     */
    data: LifeStateCreateManyInput | LifeStateCreateManyInput[]
  }

  /**
   * LifeState update
   */
  export type LifeStateUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * The data needed to update a LifeState.
     */
    data: XOR<LifeStateUpdateInput, LifeStateUncheckedUpdateInput>
    /**
     * Choose, which LifeState to update.
     */
    where: LifeStateWhereUniqueInput
  }

  /**
   * LifeState updateMany
   */
  export type LifeStateUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LifeStates.
     */
    data: XOR<LifeStateUpdateManyMutationInput, LifeStateUncheckedUpdateManyInput>
    /**
     * Filter which LifeStates to update
     */
    where?: LifeStateWhereInput
  }

  /**
   * LifeState upsert
   */
  export type LifeStateUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * The filter to search for the LifeState to update in case it exists.
     */
    where: LifeStateWhereUniqueInput
    /**
     * In case the LifeState found by the `where` argument doesn't exist, create a new LifeState with this data.
     */
    create: XOR<LifeStateCreateInput, LifeStateUncheckedCreateInput>
    /**
     * In case the LifeState was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LifeStateUpdateInput, LifeStateUncheckedUpdateInput>
  }

  /**
   * LifeState delete
   */
  export type LifeStateDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
    /**
     * Filter which LifeState to delete.
     */
    where: LifeStateWhereUniqueInput
  }

  /**
   * LifeState deleteMany
   */
  export type LifeStateDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeStates to delete
     */
    where?: LifeStateWhereInput
  }

  /**
   * LifeState findRaw
   */
  export type LifeStateFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LifeState aggregateRaw
   */
  export type LifeStateAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LifeState without action
   */
  export type LifeStateDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeState
     */
    select?: LifeStateSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeStateInclude<ExtArgs> | null
  }


  /**
   * Model LifeEvent
   */

  export type AggregateLifeEvent = {
    _count: LifeEventCountAggregateOutputType | null
    _min: LifeEventMinAggregateOutputType | null
    _max: LifeEventMaxAggregateOutputType | null
  }

  export type LifeEventMinAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    title: string | null
    description: string | null
    date: Date | null
    createdAt: Date | null
  }

  export type LifeEventMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    type: string | null
    title: string | null
    description: string | null
    date: Date | null
    createdAt: Date | null
  }

  export type LifeEventCountAggregateOutputType = {
    id: number
    userId: number
    type: number
    title: number
    description: number
    date: number
    impact: number
    metadata: number
    createdAt: number
    _all: number
  }


  export type LifeEventMinAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    description?: true
    date?: true
    createdAt?: true
  }

  export type LifeEventMaxAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    description?: true
    date?: true
    createdAt?: true
  }

  export type LifeEventCountAggregateInputType = {
    id?: true
    userId?: true
    type?: true
    title?: true
    description?: true
    date?: true
    impact?: true
    metadata?: true
    createdAt?: true
    _all?: true
  }

  export type LifeEventAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeEvent to aggregate.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned LifeEvents
    **/
    _count?: true | LifeEventCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: LifeEventMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: LifeEventMaxAggregateInputType
  }

  export type GetLifeEventAggregateType<T extends LifeEventAggregateArgs> = {
        [P in keyof T & keyof AggregateLifeEvent]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateLifeEvent[P]>
      : GetScalarType<T[P], AggregateLifeEvent[P]>
  }




  export type LifeEventGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: LifeEventWhereInput
    orderBy?: LifeEventOrderByWithAggregationInput | LifeEventOrderByWithAggregationInput[]
    by: LifeEventScalarFieldEnum[] | LifeEventScalarFieldEnum
    having?: LifeEventScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: LifeEventCountAggregateInputType | true
    _min?: LifeEventMinAggregateInputType
    _max?: LifeEventMaxAggregateInputType
  }

  export type LifeEventGroupByOutputType = {
    id: string
    userId: string
    type: string
    title: string
    description: string | null
    date: Date
    impact: JsonValue | null
    metadata: JsonValue | null
    createdAt: Date
    _count: LifeEventCountAggregateOutputType | null
    _min: LifeEventMinAggregateOutputType | null
    _max: LifeEventMaxAggregateOutputType | null
  }

  type GetLifeEventGroupByPayload<T extends LifeEventGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<LifeEventGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof LifeEventGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], LifeEventGroupByOutputType[P]>
            : GetScalarType<T[P], LifeEventGroupByOutputType[P]>
        }
      >
    >


  export type LifeEventSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    impact?: boolean
    metadata?: boolean
    createdAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["lifeEvent"]>


  export type LifeEventSelectScalar = {
    id?: boolean
    userId?: boolean
    type?: boolean
    title?: boolean
    description?: boolean
    date?: boolean
    impact?: boolean
    metadata?: boolean
    createdAt?: boolean
  }

  export type LifeEventInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
  }

  export type $LifeEventPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "LifeEvent"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      type: string
      title: string
      description: string | null
      date: Date
      impact: Prisma.JsonValue | null
      metadata: Prisma.JsonValue | null
      createdAt: Date
    }, ExtArgs["result"]["lifeEvent"]>
    composites: {}
  }

  type LifeEventGetPayload<S extends boolean | null | undefined | LifeEventDefaultArgs> = $Result.GetResult<Prisma.$LifeEventPayload, S>

  type LifeEventCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<LifeEventFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: LifeEventCountAggregateInputType | true
    }

  export interface LifeEventDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['LifeEvent'], meta: { name: 'LifeEvent' } }
    /**
     * Find zero or one LifeEvent that matches the filter.
     * @param {LifeEventFindUniqueArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends LifeEventFindUniqueArgs>(args: SelectSubset<T, LifeEventFindUniqueArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one LifeEvent that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {LifeEventFindUniqueOrThrowArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends LifeEventFindUniqueOrThrowArgs>(args: SelectSubset<T, LifeEventFindUniqueOrThrowArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first LifeEvent that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventFindFirstArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends LifeEventFindFirstArgs>(args?: SelectSubset<T, LifeEventFindFirstArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first LifeEvent that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventFindFirstOrThrowArgs} args - Arguments to find a LifeEvent
     * @example
     * // Get one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends LifeEventFindFirstOrThrowArgs>(args?: SelectSubset<T, LifeEventFindFirstOrThrowArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more LifeEvents that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all LifeEvents
     * const lifeEvents = await prisma.lifeEvent.findMany()
     * 
     * // Get first 10 LifeEvents
     * const lifeEvents = await prisma.lifeEvent.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const lifeEventWithIdOnly = await prisma.lifeEvent.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends LifeEventFindManyArgs>(args?: SelectSubset<T, LifeEventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a LifeEvent.
     * @param {LifeEventCreateArgs} args - Arguments to create a LifeEvent.
     * @example
     * // Create one LifeEvent
     * const LifeEvent = await prisma.lifeEvent.create({
     *   data: {
     *     // ... data to create a LifeEvent
     *   }
     * })
     * 
     */
    create<T extends LifeEventCreateArgs>(args: SelectSubset<T, LifeEventCreateArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many LifeEvents.
     * @param {LifeEventCreateManyArgs} args - Arguments to create many LifeEvents.
     * @example
     * // Create many LifeEvents
     * const lifeEvent = await prisma.lifeEvent.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends LifeEventCreateManyArgs>(args?: SelectSubset<T, LifeEventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a LifeEvent.
     * @param {LifeEventDeleteArgs} args - Arguments to delete one LifeEvent.
     * @example
     * // Delete one LifeEvent
     * const LifeEvent = await prisma.lifeEvent.delete({
     *   where: {
     *     // ... filter to delete one LifeEvent
     *   }
     * })
     * 
     */
    delete<T extends LifeEventDeleteArgs>(args: SelectSubset<T, LifeEventDeleteArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one LifeEvent.
     * @param {LifeEventUpdateArgs} args - Arguments to update one LifeEvent.
     * @example
     * // Update one LifeEvent
     * const lifeEvent = await prisma.lifeEvent.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends LifeEventUpdateArgs>(args: SelectSubset<T, LifeEventUpdateArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more LifeEvents.
     * @param {LifeEventDeleteManyArgs} args - Arguments to filter LifeEvents to delete.
     * @example
     * // Delete a few LifeEvents
     * const { count } = await prisma.lifeEvent.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends LifeEventDeleteManyArgs>(args?: SelectSubset<T, LifeEventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more LifeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many LifeEvents
     * const lifeEvent = await prisma.lifeEvent.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends LifeEventUpdateManyArgs>(args: SelectSubset<T, LifeEventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one LifeEvent.
     * @param {LifeEventUpsertArgs} args - Arguments to update or create a LifeEvent.
     * @example
     * // Update or create a LifeEvent
     * const lifeEvent = await prisma.lifeEvent.upsert({
     *   create: {
     *     // ... data to create a LifeEvent
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the LifeEvent we want to update
     *   }
     * })
     */
    upsert<T extends LifeEventUpsertArgs>(args: SelectSubset<T, LifeEventUpsertArgs<ExtArgs>>): Prisma__LifeEventClient<$Result.GetResult<Prisma.$LifeEventPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more LifeEvents that matches the filter.
     * @param {LifeEventFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const lifeEvent = await prisma.lifeEvent.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: LifeEventFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a LifeEvent.
     * @param {LifeEventAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const lifeEvent = await prisma.lifeEvent.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: LifeEventAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of LifeEvents.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventCountArgs} args - Arguments to filter LifeEvents to count.
     * @example
     * // Count the number of LifeEvents
     * const count = await prisma.lifeEvent.count({
     *   where: {
     *     // ... the filter for the LifeEvents we want to count
     *   }
     * })
    **/
    count<T extends LifeEventCountArgs>(
      args?: Subset<T, LifeEventCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], LifeEventCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a LifeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends LifeEventAggregateArgs>(args: Subset<T, LifeEventAggregateArgs>): Prisma.PrismaPromise<GetLifeEventAggregateType<T>>

    /**
     * Group by LifeEvent.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {LifeEventGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends LifeEventGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: LifeEventGroupByArgs['orderBy'] }
        : { orderBy?: LifeEventGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, LifeEventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetLifeEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the LifeEvent model
   */
  readonly fields: LifeEventFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for LifeEvent.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__LifeEventClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the LifeEvent model
   */ 
  interface LifeEventFieldRefs {
    readonly id: FieldRef<"LifeEvent", 'String'>
    readonly userId: FieldRef<"LifeEvent", 'String'>
    readonly type: FieldRef<"LifeEvent", 'String'>
    readonly title: FieldRef<"LifeEvent", 'String'>
    readonly description: FieldRef<"LifeEvent", 'String'>
    readonly date: FieldRef<"LifeEvent", 'DateTime'>
    readonly impact: FieldRef<"LifeEvent", 'Json'>
    readonly metadata: FieldRef<"LifeEvent", 'Json'>
    readonly createdAt: FieldRef<"LifeEvent", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * LifeEvent findUnique
   */
  export type LifeEventFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent findUniqueOrThrow
   */
  export type LifeEventFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent findFirst
   */
  export type LifeEventFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeEvents.
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeEvents.
     */
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * LifeEvent findFirstOrThrow
   */
  export type LifeEventFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvent to fetch.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for LifeEvents.
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of LifeEvents.
     */
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * LifeEvent findMany
   */
  export type LifeEventFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter, which LifeEvents to fetch.
     */
    where?: LifeEventWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of LifeEvents to fetch.
     */
    orderBy?: LifeEventOrderByWithRelationInput | LifeEventOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing LifeEvents.
     */
    cursor?: LifeEventWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` LifeEvents from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` LifeEvents.
     */
    skip?: number
    distinct?: LifeEventScalarFieldEnum | LifeEventScalarFieldEnum[]
  }

  /**
   * LifeEvent create
   */
  export type LifeEventCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * The data needed to create a LifeEvent.
     */
    data: XOR<LifeEventCreateInput, LifeEventUncheckedCreateInput>
  }

  /**
   * LifeEvent createMany
   */
  export type LifeEventCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many LifeEvents.
     */
    data: LifeEventCreateManyInput | LifeEventCreateManyInput[]
  }

  /**
   * LifeEvent update
   */
  export type LifeEventUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * The data needed to update a LifeEvent.
     */
    data: XOR<LifeEventUpdateInput, LifeEventUncheckedUpdateInput>
    /**
     * Choose, which LifeEvent to update.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent updateMany
   */
  export type LifeEventUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update LifeEvents.
     */
    data: XOR<LifeEventUpdateManyMutationInput, LifeEventUncheckedUpdateManyInput>
    /**
     * Filter which LifeEvents to update
     */
    where?: LifeEventWhereInput
  }

  /**
   * LifeEvent upsert
   */
  export type LifeEventUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * The filter to search for the LifeEvent to update in case it exists.
     */
    where: LifeEventWhereUniqueInput
    /**
     * In case the LifeEvent found by the `where` argument doesn't exist, create a new LifeEvent with this data.
     */
    create: XOR<LifeEventCreateInput, LifeEventUncheckedCreateInput>
    /**
     * In case the LifeEvent was found with the provided `where` argument, update it with this data.
     */
    update: XOR<LifeEventUpdateInput, LifeEventUncheckedUpdateInput>
  }

  /**
   * LifeEvent delete
   */
  export type LifeEventDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
    /**
     * Filter which LifeEvent to delete.
     */
    where: LifeEventWhereUniqueInput
  }

  /**
   * LifeEvent deleteMany
   */
  export type LifeEventDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which LifeEvents to delete
     */
    where?: LifeEventWhereInput
  }

  /**
   * LifeEvent findRaw
   */
  export type LifeEventFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LifeEvent aggregateRaw
   */
  export type LifeEventAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * LifeEvent without action
   */
  export type LifeEventDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the LifeEvent
     */
    select?: LifeEventSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: LifeEventInclude<ExtArgs> | null
  }


  /**
   * Model Goal
   */

  export type AggregateGoal = {
    _count: GoalCountAggregateOutputType | null
    _avg: GoalAvgAggregateOutputType | null
    _sum: GoalSumAggregateOutputType | null
    _min: GoalMinAggregateOutputType | null
    _max: GoalMaxAggregateOutputType | null
  }

  export type GoalAvgAggregateOutputType = {
    progress: number | null
  }

  export type GoalSumAggregateOutputType = {
    progress: number | null
  }

  export type GoalMinAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    description: string | null
    dimensionId: string | null
    progress: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoalMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    title: string | null
    description: string | null
    dimensionId: string | null
    progress: number | null
    status: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoalCountAggregateOutputType = {
    id: number
    userId: number
    title: number
    description: number
    dimensionId: number
    progress: number
    status: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GoalAvgAggregateInputType = {
    progress?: true
  }

  export type GoalSumAggregateInputType = {
    progress?: true
  }

  export type GoalMinAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    description?: true
    dimensionId?: true
    progress?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoalMaxAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    description?: true
    dimensionId?: true
    progress?: true
    status?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoalCountAggregateInputType = {
    id?: true
    userId?: true
    title?: true
    description?: true
    dimensionId?: true
    progress?: true
    status?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GoalAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Goal to aggregate.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Goals
    **/
    _count?: true | GoalCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: GoalAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: GoalSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GoalMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GoalMaxAggregateInputType
  }

  export type GetGoalAggregateType<T extends GoalAggregateArgs> = {
        [P in keyof T & keyof AggregateGoal]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGoal[P]>
      : GetScalarType<T[P], AggregateGoal[P]>
  }




  export type GoalGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoalWhereInput
    orderBy?: GoalOrderByWithAggregationInput | GoalOrderByWithAggregationInput[]
    by: GoalScalarFieldEnum[] | GoalScalarFieldEnum
    having?: GoalScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GoalCountAggregateInputType | true
    _avg?: GoalAvgAggregateInputType
    _sum?: GoalSumAggregateInputType
    _min?: GoalMinAggregateInputType
    _max?: GoalMaxAggregateInputType
  }

  export type GoalGroupByOutputType = {
    id: string
    userId: string
    title: string
    description: string | null
    dimensionId: string | null
    progress: number
    status: string
    createdAt: Date
    updatedAt: Date | null
    _count: GoalCountAggregateOutputType | null
    _avg: GoalAvgAggregateOutputType | null
    _sum: GoalSumAggregateOutputType | null
    _min: GoalMinAggregateOutputType | null
    _max: GoalMaxAggregateOutputType | null
  }

  type GetGoalGroupByPayload<T extends GoalGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GoalGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GoalGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GoalGroupByOutputType[P]>
            : GetScalarType<T[P], GoalGroupByOutputType[P]>
        }
      >
    >


  export type GoalSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    title?: boolean
    description?: boolean
    dimensionId?: boolean
    progress?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    user?: boolean | UserDefaultArgs<ExtArgs>
    actions?: boolean | Goal$actionsArgs<ExtArgs>
    _count?: boolean | GoalCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goal"]>


  export type GoalSelectScalar = {
    id?: boolean
    userId?: boolean
    title?: boolean
    description?: boolean
    dimensionId?: boolean
    progress?: boolean
    status?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GoalInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    user?: boolean | UserDefaultArgs<ExtArgs>
    actions?: boolean | Goal$actionsArgs<ExtArgs>
    _count?: boolean | GoalCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $GoalPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Goal"
    objects: {
      user: Prisma.$UserPayload<ExtArgs>
      actions: Prisma.$GoalActionPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      title: string
      description: string | null
      dimensionId: string | null
      progress: number
      status: string
      createdAt: Date
      updatedAt: Date | null
    }, ExtArgs["result"]["goal"]>
    composites: {}
  }

  type GoalGetPayload<S extends boolean | null | undefined | GoalDefaultArgs> = $Result.GetResult<Prisma.$GoalPayload, S>

  type GoalCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GoalFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GoalCountAggregateInputType | true
    }

  export interface GoalDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Goal'], meta: { name: 'Goal' } }
    /**
     * Find zero or one Goal that matches the filter.
     * @param {GoalFindUniqueArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GoalFindUniqueArgs>(args: SelectSubset<T, GoalFindUniqueArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Goal that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GoalFindUniqueOrThrowArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GoalFindUniqueOrThrowArgs>(args: SelectSubset<T, GoalFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Goal that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalFindFirstArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GoalFindFirstArgs>(args?: SelectSubset<T, GoalFindFirstArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Goal that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalFindFirstOrThrowArgs} args - Arguments to find a Goal
     * @example
     * // Get one Goal
     * const goal = await prisma.goal.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GoalFindFirstOrThrowArgs>(args?: SelectSubset<T, GoalFindFirstOrThrowArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Goals that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Goals
     * const goals = await prisma.goal.findMany()
     * 
     * // Get first 10 Goals
     * const goals = await prisma.goal.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const goalWithIdOnly = await prisma.goal.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GoalFindManyArgs>(args?: SelectSubset<T, GoalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Goal.
     * @param {GoalCreateArgs} args - Arguments to create a Goal.
     * @example
     * // Create one Goal
     * const Goal = await prisma.goal.create({
     *   data: {
     *     // ... data to create a Goal
     *   }
     * })
     * 
     */
    create<T extends GoalCreateArgs>(args: SelectSubset<T, GoalCreateArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Goals.
     * @param {GoalCreateManyArgs} args - Arguments to create many Goals.
     * @example
     * // Create many Goals
     * const goal = await prisma.goal.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GoalCreateManyArgs>(args?: SelectSubset<T, GoalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Goal.
     * @param {GoalDeleteArgs} args - Arguments to delete one Goal.
     * @example
     * // Delete one Goal
     * const Goal = await prisma.goal.delete({
     *   where: {
     *     // ... filter to delete one Goal
     *   }
     * })
     * 
     */
    delete<T extends GoalDeleteArgs>(args: SelectSubset<T, GoalDeleteArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Goal.
     * @param {GoalUpdateArgs} args - Arguments to update one Goal.
     * @example
     * // Update one Goal
     * const goal = await prisma.goal.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GoalUpdateArgs>(args: SelectSubset<T, GoalUpdateArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Goals.
     * @param {GoalDeleteManyArgs} args - Arguments to filter Goals to delete.
     * @example
     * // Delete a few Goals
     * const { count } = await prisma.goal.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GoalDeleteManyArgs>(args?: SelectSubset<T, GoalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Goals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Goals
     * const goal = await prisma.goal.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GoalUpdateManyArgs>(args: SelectSubset<T, GoalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Goal.
     * @param {GoalUpsertArgs} args - Arguments to update or create a Goal.
     * @example
     * // Update or create a Goal
     * const goal = await prisma.goal.upsert({
     *   create: {
     *     // ... data to create a Goal
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Goal we want to update
     *   }
     * })
     */
    upsert<T extends GoalUpsertArgs>(args: SelectSubset<T, GoalUpsertArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Goals that matches the filter.
     * @param {GoalFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const goal = await prisma.goal.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: GoalFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Goal.
     * @param {GoalAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const goal = await prisma.goal.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: GoalAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Goals.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalCountArgs} args - Arguments to filter Goals to count.
     * @example
     * // Count the number of Goals
     * const count = await prisma.goal.count({
     *   where: {
     *     // ... the filter for the Goals we want to count
     *   }
     * })
    **/
    count<T extends GoalCountArgs>(
      args?: Subset<T, GoalCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GoalCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Goal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GoalAggregateArgs>(args: Subset<T, GoalAggregateArgs>): Prisma.PrismaPromise<GetGoalAggregateType<T>>

    /**
     * Group by Goal.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GoalGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GoalGroupByArgs['orderBy'] }
        : { orderBy?: GoalGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GoalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Goal model
   */
  readonly fields: GoalFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Goal.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GoalClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    actions<T extends Goal$actionsArgs<ExtArgs> = {}>(args?: Subset<T, Goal$actionsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Goal model
   */ 
  interface GoalFieldRefs {
    readonly id: FieldRef<"Goal", 'String'>
    readonly userId: FieldRef<"Goal", 'String'>
    readonly title: FieldRef<"Goal", 'String'>
    readonly description: FieldRef<"Goal", 'String'>
    readonly dimensionId: FieldRef<"Goal", 'String'>
    readonly progress: FieldRef<"Goal", 'Float'>
    readonly status: FieldRef<"Goal", 'String'>
    readonly createdAt: FieldRef<"Goal", 'DateTime'>
    readonly updatedAt: FieldRef<"Goal", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Goal findUnique
   */
  export type GoalFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal findUniqueOrThrow
   */
  export type GoalFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal findFirst
   */
  export type GoalFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Goals.
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Goals.
     */
    distinct?: GoalScalarFieldEnum | GoalScalarFieldEnum[]
  }

  /**
   * Goal findFirstOrThrow
   */
  export type GoalFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goal to fetch.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Goals.
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Goals.
     */
    distinct?: GoalScalarFieldEnum | GoalScalarFieldEnum[]
  }

  /**
   * Goal findMany
   */
  export type GoalFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter, which Goals to fetch.
     */
    where?: GoalWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Goals to fetch.
     */
    orderBy?: GoalOrderByWithRelationInput | GoalOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Goals.
     */
    cursor?: GoalWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Goals from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Goals.
     */
    skip?: number
    distinct?: GoalScalarFieldEnum | GoalScalarFieldEnum[]
  }

  /**
   * Goal create
   */
  export type GoalCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * The data needed to create a Goal.
     */
    data: XOR<GoalCreateInput, GoalUncheckedCreateInput>
  }

  /**
   * Goal createMany
   */
  export type GoalCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Goals.
     */
    data: GoalCreateManyInput | GoalCreateManyInput[]
  }

  /**
   * Goal update
   */
  export type GoalUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * The data needed to update a Goal.
     */
    data: XOR<GoalUpdateInput, GoalUncheckedUpdateInput>
    /**
     * Choose, which Goal to update.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal updateMany
   */
  export type GoalUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Goals.
     */
    data: XOR<GoalUpdateManyMutationInput, GoalUncheckedUpdateManyInput>
    /**
     * Filter which Goals to update
     */
    where?: GoalWhereInput
  }

  /**
   * Goal upsert
   */
  export type GoalUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * The filter to search for the Goal to update in case it exists.
     */
    where: GoalWhereUniqueInput
    /**
     * In case the Goal found by the `where` argument doesn't exist, create a new Goal with this data.
     */
    create: XOR<GoalCreateInput, GoalUncheckedCreateInput>
    /**
     * In case the Goal was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GoalUpdateInput, GoalUncheckedUpdateInput>
  }

  /**
   * Goal delete
   */
  export type GoalDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
    /**
     * Filter which Goal to delete.
     */
    where: GoalWhereUniqueInput
  }

  /**
   * Goal deleteMany
   */
  export type GoalDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Goals to delete
     */
    where?: GoalWhereInput
  }

  /**
   * Goal findRaw
   */
  export type GoalFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Goal aggregateRaw
   */
  export type GoalAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Goal.actions
   */
  export type Goal$actionsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    where?: GoalActionWhereInput
    orderBy?: GoalActionOrderByWithRelationInput | GoalActionOrderByWithRelationInput[]
    cursor?: GoalActionWhereUniqueInput
    take?: number
    skip?: number
    distinct?: GoalActionScalarFieldEnum | GoalActionScalarFieldEnum[]
  }

  /**
   * Goal without action
   */
  export type GoalDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Goal
     */
    select?: GoalSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalInclude<ExtArgs> | null
  }


  /**
   * Model GoalAction
   */

  export type AggregateGoalAction = {
    _count: GoalActionCountAggregateOutputType | null
    _min: GoalActionMinAggregateOutputType | null
    _max: GoalActionMaxAggregateOutputType | null
  }

  export type GoalActionMinAggregateOutputType = {
    id: string | null
    goalId: string | null
    title: string | null
    description: string | null
    isCompleted: boolean | null
    targetDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoalActionMaxAggregateOutputType = {
    id: string | null
    goalId: string | null
    title: string | null
    description: string | null
    isCompleted: boolean | null
    targetDate: Date | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type GoalActionCountAggregateOutputType = {
    id: number
    goalId: number
    title: number
    description: number
    isCompleted: number
    targetDate: number
    dimensions: number
    attributes: number
    impact: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type GoalActionMinAggregateInputType = {
    id?: true
    goalId?: true
    title?: true
    description?: true
    isCompleted?: true
    targetDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoalActionMaxAggregateInputType = {
    id?: true
    goalId?: true
    title?: true
    description?: true
    isCompleted?: true
    targetDate?: true
    createdAt?: true
    updatedAt?: true
  }

  export type GoalActionCountAggregateInputType = {
    id?: true
    goalId?: true
    title?: true
    description?: true
    isCompleted?: true
    targetDate?: true
    dimensions?: true
    attributes?: true
    impact?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type GoalActionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoalAction to aggregate.
     */
    where?: GoalActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalActions to fetch.
     */
    orderBy?: GoalActionOrderByWithRelationInput | GoalActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: GoalActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned GoalActions
    **/
    _count?: true | GoalActionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: GoalActionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: GoalActionMaxAggregateInputType
  }

  export type GetGoalActionAggregateType<T extends GoalActionAggregateArgs> = {
        [P in keyof T & keyof AggregateGoalAction]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateGoalAction[P]>
      : GetScalarType<T[P], AggregateGoalAction[P]>
  }




  export type GoalActionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: GoalActionWhereInput
    orderBy?: GoalActionOrderByWithAggregationInput | GoalActionOrderByWithAggregationInput[]
    by: GoalActionScalarFieldEnum[] | GoalActionScalarFieldEnum
    having?: GoalActionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: GoalActionCountAggregateInputType | true
    _min?: GoalActionMinAggregateInputType
    _max?: GoalActionMaxAggregateInputType
  }

  export type GoalActionGroupByOutputType = {
    id: string
    goalId: string
    title: string
    description: string | null
    isCompleted: boolean
    targetDate: Date | null
    dimensions: string[]
    attributes: string[]
    impact: JsonValue | null
    createdAt: Date
    updatedAt: Date | null
    _count: GoalActionCountAggregateOutputType | null
    _min: GoalActionMinAggregateOutputType | null
    _max: GoalActionMaxAggregateOutputType | null
  }

  type GetGoalActionGroupByPayload<T extends GoalActionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<GoalActionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof GoalActionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], GoalActionGroupByOutputType[P]>
            : GetScalarType<T[P], GoalActionGroupByOutputType[P]>
        }
      >
    >


  export type GoalActionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    goalId?: boolean
    title?: boolean
    description?: boolean
    isCompleted?: boolean
    targetDate?: boolean
    dimensions?: boolean
    attributes?: boolean
    impact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    goal?: boolean | GoalDefaultArgs<ExtArgs>
    tasks?: boolean | GoalAction$tasksArgs<ExtArgs>
    _count?: boolean | GoalActionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["goalAction"]>


  export type GoalActionSelectScalar = {
    id?: boolean
    goalId?: boolean
    title?: boolean
    description?: boolean
    isCompleted?: boolean
    targetDate?: boolean
    dimensions?: boolean
    attributes?: boolean
    impact?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type GoalActionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    goal?: boolean | GoalDefaultArgs<ExtArgs>
    tasks?: boolean | GoalAction$tasksArgs<ExtArgs>
    _count?: boolean | GoalActionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $GoalActionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "GoalAction"
    objects: {
      goal: Prisma.$GoalPayload<ExtArgs>
      tasks: Prisma.$TaskPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      goalId: string
      title: string
      description: string | null
      isCompleted: boolean
      targetDate: Date | null
      dimensions: string[]
      attributes: string[]
      impact: Prisma.JsonValue | null
      createdAt: Date
      updatedAt: Date | null
    }, ExtArgs["result"]["goalAction"]>
    composites: {}
  }

  type GoalActionGetPayload<S extends boolean | null | undefined | GoalActionDefaultArgs> = $Result.GetResult<Prisma.$GoalActionPayload, S>

  type GoalActionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<GoalActionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: GoalActionCountAggregateInputType | true
    }

  export interface GoalActionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['GoalAction'], meta: { name: 'GoalAction' } }
    /**
     * Find zero or one GoalAction that matches the filter.
     * @param {GoalActionFindUniqueArgs} args - Arguments to find a GoalAction
     * @example
     * // Get one GoalAction
     * const goalAction = await prisma.goalAction.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends GoalActionFindUniqueArgs>(args: SelectSubset<T, GoalActionFindUniqueArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one GoalAction that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {GoalActionFindUniqueOrThrowArgs} args - Arguments to find a GoalAction
     * @example
     * // Get one GoalAction
     * const goalAction = await prisma.goalAction.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends GoalActionFindUniqueOrThrowArgs>(args: SelectSubset<T, GoalActionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first GoalAction that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalActionFindFirstArgs} args - Arguments to find a GoalAction
     * @example
     * // Get one GoalAction
     * const goalAction = await prisma.goalAction.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends GoalActionFindFirstArgs>(args?: SelectSubset<T, GoalActionFindFirstArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first GoalAction that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalActionFindFirstOrThrowArgs} args - Arguments to find a GoalAction
     * @example
     * // Get one GoalAction
     * const goalAction = await prisma.goalAction.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends GoalActionFindFirstOrThrowArgs>(args?: SelectSubset<T, GoalActionFindFirstOrThrowArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more GoalActions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalActionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all GoalActions
     * const goalActions = await prisma.goalAction.findMany()
     * 
     * // Get first 10 GoalActions
     * const goalActions = await prisma.goalAction.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const goalActionWithIdOnly = await prisma.goalAction.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends GoalActionFindManyArgs>(args?: SelectSubset<T, GoalActionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a GoalAction.
     * @param {GoalActionCreateArgs} args - Arguments to create a GoalAction.
     * @example
     * // Create one GoalAction
     * const GoalAction = await prisma.goalAction.create({
     *   data: {
     *     // ... data to create a GoalAction
     *   }
     * })
     * 
     */
    create<T extends GoalActionCreateArgs>(args: SelectSubset<T, GoalActionCreateArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many GoalActions.
     * @param {GoalActionCreateManyArgs} args - Arguments to create many GoalActions.
     * @example
     * // Create many GoalActions
     * const goalAction = await prisma.goalAction.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends GoalActionCreateManyArgs>(args?: SelectSubset<T, GoalActionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a GoalAction.
     * @param {GoalActionDeleteArgs} args - Arguments to delete one GoalAction.
     * @example
     * // Delete one GoalAction
     * const GoalAction = await prisma.goalAction.delete({
     *   where: {
     *     // ... filter to delete one GoalAction
     *   }
     * })
     * 
     */
    delete<T extends GoalActionDeleteArgs>(args: SelectSubset<T, GoalActionDeleteArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one GoalAction.
     * @param {GoalActionUpdateArgs} args - Arguments to update one GoalAction.
     * @example
     * // Update one GoalAction
     * const goalAction = await prisma.goalAction.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends GoalActionUpdateArgs>(args: SelectSubset<T, GoalActionUpdateArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more GoalActions.
     * @param {GoalActionDeleteManyArgs} args - Arguments to filter GoalActions to delete.
     * @example
     * // Delete a few GoalActions
     * const { count } = await prisma.goalAction.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends GoalActionDeleteManyArgs>(args?: SelectSubset<T, GoalActionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more GoalActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalActionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many GoalActions
     * const goalAction = await prisma.goalAction.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends GoalActionUpdateManyArgs>(args: SelectSubset<T, GoalActionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one GoalAction.
     * @param {GoalActionUpsertArgs} args - Arguments to update or create a GoalAction.
     * @example
     * // Update or create a GoalAction
     * const goalAction = await prisma.goalAction.upsert({
     *   create: {
     *     // ... data to create a GoalAction
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the GoalAction we want to update
     *   }
     * })
     */
    upsert<T extends GoalActionUpsertArgs>(args: SelectSubset<T, GoalActionUpsertArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more GoalActions that matches the filter.
     * @param {GoalActionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const goalAction = await prisma.goalAction.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: GoalActionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a GoalAction.
     * @param {GoalActionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const goalAction = await prisma.goalAction.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: GoalActionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of GoalActions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalActionCountArgs} args - Arguments to filter GoalActions to count.
     * @example
     * // Count the number of GoalActions
     * const count = await prisma.goalAction.count({
     *   where: {
     *     // ... the filter for the GoalActions we want to count
     *   }
     * })
    **/
    count<T extends GoalActionCountArgs>(
      args?: Subset<T, GoalActionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], GoalActionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a GoalAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalActionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends GoalActionAggregateArgs>(args: Subset<T, GoalActionAggregateArgs>): Prisma.PrismaPromise<GetGoalActionAggregateType<T>>

    /**
     * Group by GoalAction.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {GoalActionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends GoalActionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: GoalActionGroupByArgs['orderBy'] }
        : { orderBy?: GoalActionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, GoalActionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetGoalActionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the GoalAction model
   */
  readonly fields: GoalActionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for GoalAction.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__GoalActionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    goal<T extends GoalDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GoalDefaultArgs<ExtArgs>>): Prisma__GoalClient<$Result.GetResult<Prisma.$GoalPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    tasks<T extends GoalAction$tasksArgs<ExtArgs> = {}>(args?: Subset<T, GoalAction$tasksArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany"> | Null>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the GoalAction model
   */ 
  interface GoalActionFieldRefs {
    readonly id: FieldRef<"GoalAction", 'String'>
    readonly goalId: FieldRef<"GoalAction", 'String'>
    readonly title: FieldRef<"GoalAction", 'String'>
    readonly description: FieldRef<"GoalAction", 'String'>
    readonly isCompleted: FieldRef<"GoalAction", 'Boolean'>
    readonly targetDate: FieldRef<"GoalAction", 'DateTime'>
    readonly dimensions: FieldRef<"GoalAction", 'String[]'>
    readonly attributes: FieldRef<"GoalAction", 'String[]'>
    readonly impact: FieldRef<"GoalAction", 'Json'>
    readonly createdAt: FieldRef<"GoalAction", 'DateTime'>
    readonly updatedAt: FieldRef<"GoalAction", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * GoalAction findUnique
   */
  export type GoalActionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * Filter, which GoalAction to fetch.
     */
    where: GoalActionWhereUniqueInput
  }

  /**
   * GoalAction findUniqueOrThrow
   */
  export type GoalActionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * Filter, which GoalAction to fetch.
     */
    where: GoalActionWhereUniqueInput
  }

  /**
   * GoalAction findFirst
   */
  export type GoalActionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * Filter, which GoalAction to fetch.
     */
    where?: GoalActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalActions to fetch.
     */
    orderBy?: GoalActionOrderByWithRelationInput | GoalActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoalActions.
     */
    cursor?: GoalActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoalActions.
     */
    distinct?: GoalActionScalarFieldEnum | GoalActionScalarFieldEnum[]
  }

  /**
   * GoalAction findFirstOrThrow
   */
  export type GoalActionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * Filter, which GoalAction to fetch.
     */
    where?: GoalActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalActions to fetch.
     */
    orderBy?: GoalActionOrderByWithRelationInput | GoalActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for GoalActions.
     */
    cursor?: GoalActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalActions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of GoalActions.
     */
    distinct?: GoalActionScalarFieldEnum | GoalActionScalarFieldEnum[]
  }

  /**
   * GoalAction findMany
   */
  export type GoalActionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * Filter, which GoalActions to fetch.
     */
    where?: GoalActionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of GoalActions to fetch.
     */
    orderBy?: GoalActionOrderByWithRelationInput | GoalActionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing GoalActions.
     */
    cursor?: GoalActionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` GoalActions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` GoalActions.
     */
    skip?: number
    distinct?: GoalActionScalarFieldEnum | GoalActionScalarFieldEnum[]
  }

  /**
   * GoalAction create
   */
  export type GoalActionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * The data needed to create a GoalAction.
     */
    data: XOR<GoalActionCreateInput, GoalActionUncheckedCreateInput>
  }

  /**
   * GoalAction createMany
   */
  export type GoalActionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many GoalActions.
     */
    data: GoalActionCreateManyInput | GoalActionCreateManyInput[]
  }

  /**
   * GoalAction update
   */
  export type GoalActionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * The data needed to update a GoalAction.
     */
    data: XOR<GoalActionUpdateInput, GoalActionUncheckedUpdateInput>
    /**
     * Choose, which GoalAction to update.
     */
    where: GoalActionWhereUniqueInput
  }

  /**
   * GoalAction updateMany
   */
  export type GoalActionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update GoalActions.
     */
    data: XOR<GoalActionUpdateManyMutationInput, GoalActionUncheckedUpdateManyInput>
    /**
     * Filter which GoalActions to update
     */
    where?: GoalActionWhereInput
  }

  /**
   * GoalAction upsert
   */
  export type GoalActionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * The filter to search for the GoalAction to update in case it exists.
     */
    where: GoalActionWhereUniqueInput
    /**
     * In case the GoalAction found by the `where` argument doesn't exist, create a new GoalAction with this data.
     */
    create: XOR<GoalActionCreateInput, GoalActionUncheckedCreateInput>
    /**
     * In case the GoalAction was found with the provided `where` argument, update it with this data.
     */
    update: XOR<GoalActionUpdateInput, GoalActionUncheckedUpdateInput>
  }

  /**
   * GoalAction delete
   */
  export type GoalActionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
    /**
     * Filter which GoalAction to delete.
     */
    where: GoalActionWhereUniqueInput
  }

  /**
   * GoalAction deleteMany
   */
  export type GoalActionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which GoalActions to delete
     */
    where?: GoalActionWhereInput
  }

  /**
   * GoalAction findRaw
   */
  export type GoalActionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * GoalAction aggregateRaw
   */
  export type GoalActionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * GoalAction.tasks
   */
  export type GoalAction$tasksArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    cursor?: TaskWhereUniqueInput
    take?: number
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * GoalAction without action
   */
  export type GoalActionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the GoalAction
     */
    select?: GoalActionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: GoalActionInclude<ExtArgs> | null
  }


  /**
   * Model Task
   */

  export type AggregateTask = {
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  export type TaskAvgAggregateOutputType = {
    estimatedHours: number | null
  }

  export type TaskSumAggregateOutputType = {
    estimatedHours: number | null
  }

  export type TaskMinAggregateOutputType = {
    id: string | null
    goalActionId: string | null
    title: string | null
    description: string | null
    isCompleted: boolean | null
    startDate: Date | null
    endDate: Date | null
    estimatedHours: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskMaxAggregateOutputType = {
    id: string | null
    goalActionId: string | null
    title: string | null
    description: string | null
    isCompleted: boolean | null
    startDate: Date | null
    endDate: Date | null
    estimatedHours: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type TaskCountAggregateOutputType = {
    id: number
    goalActionId: number
    title: number
    description: number
    isCompleted: number
    startDate: number
    endDate: number
    estimatedHours: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type TaskAvgAggregateInputType = {
    estimatedHours?: true
  }

  export type TaskSumAggregateInputType = {
    estimatedHours?: true
  }

  export type TaskMinAggregateInputType = {
    id?: true
    goalActionId?: true
    title?: true
    description?: true
    isCompleted?: true
    startDate?: true
    endDate?: true
    estimatedHours?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskMaxAggregateInputType = {
    id?: true
    goalActionId?: true
    title?: true
    description?: true
    isCompleted?: true
    startDate?: true
    endDate?: true
    estimatedHours?: true
    createdAt?: true
    updatedAt?: true
  }

  export type TaskCountAggregateInputType = {
    id?: true
    goalActionId?: true
    title?: true
    description?: true
    isCompleted?: true
    startDate?: true
    endDate?: true
    estimatedHours?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type TaskAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Task to aggregate.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned Tasks
    **/
    _count?: true | TaskCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: TaskAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: TaskSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: TaskMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: TaskMaxAggregateInputType
  }

  export type GetTaskAggregateType<T extends TaskAggregateArgs> = {
        [P in keyof T & keyof AggregateTask]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateTask[P]>
      : GetScalarType<T[P], AggregateTask[P]>
  }




  export type TaskGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: TaskWhereInput
    orderBy?: TaskOrderByWithAggregationInput | TaskOrderByWithAggregationInput[]
    by: TaskScalarFieldEnum[] | TaskScalarFieldEnum
    having?: TaskScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: TaskCountAggregateInputType | true
    _avg?: TaskAvgAggregateInputType
    _sum?: TaskSumAggregateInputType
    _min?: TaskMinAggregateInputType
    _max?: TaskMaxAggregateInputType
  }

  export type TaskGroupByOutputType = {
    id: string
    goalActionId: string
    title: string
    description: string | null
    isCompleted: boolean
    startDate: Date | null
    endDate: Date | null
    estimatedHours: number | null
    createdAt: Date
    updatedAt: Date | null
    _count: TaskCountAggregateOutputType | null
    _avg: TaskAvgAggregateOutputType | null
    _sum: TaskSumAggregateOutputType | null
    _min: TaskMinAggregateOutputType | null
    _max: TaskMaxAggregateOutputType | null
  }

  type GetTaskGroupByPayload<T extends TaskGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<TaskGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof TaskGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], TaskGroupByOutputType[P]>
            : GetScalarType<T[P], TaskGroupByOutputType[P]>
        }
      >
    >


  export type TaskSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    goalActionId?: boolean
    title?: boolean
    description?: boolean
    isCompleted?: boolean
    startDate?: boolean
    endDate?: boolean
    estimatedHours?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    goalAction?: boolean | GoalActionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["task"]>


  export type TaskSelectScalar = {
    id?: boolean
    goalActionId?: boolean
    title?: boolean
    description?: boolean
    isCompleted?: boolean
    startDate?: boolean
    endDate?: boolean
    estimatedHours?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type TaskInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    goalAction?: boolean | GoalActionDefaultArgs<ExtArgs>
  }

  export type $TaskPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "Task"
    objects: {
      goalAction: Prisma.$GoalActionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      goalActionId: string
      title: string
      description: string | null
      isCompleted: boolean
      startDate: Date | null
      endDate: Date | null
      estimatedHours: number | null
      createdAt: Date
      updatedAt: Date | null
    }, ExtArgs["result"]["task"]>
    composites: {}
  }

  type TaskGetPayload<S extends boolean | null | undefined | TaskDefaultArgs> = $Result.GetResult<Prisma.$TaskPayload, S>

  type TaskCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<TaskFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: TaskCountAggregateInputType | true
    }

  export interface TaskDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['Task'], meta: { name: 'Task' } }
    /**
     * Find zero or one Task that matches the filter.
     * @param {TaskFindUniqueArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends TaskFindUniqueArgs>(args: SelectSubset<T, TaskFindUniqueArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one Task that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {TaskFindUniqueOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends TaskFindUniqueOrThrowArgs>(args: SelectSubset<T, TaskFindUniqueOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first Task that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends TaskFindFirstArgs>(args?: SelectSubset<T, TaskFindFirstArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first Task that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindFirstOrThrowArgs} args - Arguments to find a Task
     * @example
     * // Get one Task
     * const task = await prisma.task.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends TaskFindFirstOrThrowArgs>(args?: SelectSubset<T, TaskFindFirstOrThrowArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all Tasks
     * const tasks = await prisma.task.findMany()
     * 
     * // Get first 10 Tasks
     * const tasks = await prisma.task.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const taskWithIdOnly = await prisma.task.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends TaskFindManyArgs>(args?: SelectSubset<T, TaskFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a Task.
     * @param {TaskCreateArgs} args - Arguments to create a Task.
     * @example
     * // Create one Task
     * const Task = await prisma.task.create({
     *   data: {
     *     // ... data to create a Task
     *   }
     * })
     * 
     */
    create<T extends TaskCreateArgs>(args: SelectSubset<T, TaskCreateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many Tasks.
     * @param {TaskCreateManyArgs} args - Arguments to create many Tasks.
     * @example
     * // Create many Tasks
     * const task = await prisma.task.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends TaskCreateManyArgs>(args?: SelectSubset<T, TaskCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a Task.
     * @param {TaskDeleteArgs} args - Arguments to delete one Task.
     * @example
     * // Delete one Task
     * const Task = await prisma.task.delete({
     *   where: {
     *     // ... filter to delete one Task
     *   }
     * })
     * 
     */
    delete<T extends TaskDeleteArgs>(args: SelectSubset<T, TaskDeleteArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one Task.
     * @param {TaskUpdateArgs} args - Arguments to update one Task.
     * @example
     * // Update one Task
     * const task = await prisma.task.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends TaskUpdateArgs>(args: SelectSubset<T, TaskUpdateArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more Tasks.
     * @param {TaskDeleteManyArgs} args - Arguments to filter Tasks to delete.
     * @example
     * // Delete a few Tasks
     * const { count } = await prisma.task.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends TaskDeleteManyArgs>(args?: SelectSubset<T, TaskDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many Tasks
     * const task = await prisma.task.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends TaskUpdateManyArgs>(args: SelectSubset<T, TaskUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one Task.
     * @param {TaskUpsertArgs} args - Arguments to update or create a Task.
     * @example
     * // Update or create a Task
     * const task = await prisma.task.upsert({
     *   create: {
     *     // ... data to create a Task
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the Task we want to update
     *   }
     * })
     */
    upsert<T extends TaskUpsertArgs>(args: SelectSubset<T, TaskUpsertArgs<ExtArgs>>): Prisma__TaskClient<$Result.GetResult<Prisma.$TaskPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more Tasks that matches the filter.
     * @param {TaskFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const task = await prisma.task.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: TaskFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a Task.
     * @param {TaskAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const task = await prisma.task.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: TaskAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of Tasks.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskCountArgs} args - Arguments to filter Tasks to count.
     * @example
     * // Count the number of Tasks
     * const count = await prisma.task.count({
     *   where: {
     *     // ... the filter for the Tasks we want to count
     *   }
     * })
    **/
    count<T extends TaskCountArgs>(
      args?: Subset<T, TaskCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], TaskCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends TaskAggregateArgs>(args: Subset<T, TaskAggregateArgs>): Prisma.PrismaPromise<GetTaskAggregateType<T>>

    /**
     * Group by Task.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {TaskGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends TaskGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: TaskGroupByArgs['orderBy'] }
        : { orderBy?: TaskGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, TaskGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTaskGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the Task model
   */
  readonly fields: TaskFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for Task.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__TaskClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    goalAction<T extends GoalActionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, GoalActionDefaultArgs<ExtArgs>>): Prisma__GoalActionClient<$Result.GetResult<Prisma.$GoalActionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the Task model
   */ 
  interface TaskFieldRefs {
    readonly id: FieldRef<"Task", 'String'>
    readonly goalActionId: FieldRef<"Task", 'String'>
    readonly title: FieldRef<"Task", 'String'>
    readonly description: FieldRef<"Task", 'String'>
    readonly isCompleted: FieldRef<"Task", 'Boolean'>
    readonly startDate: FieldRef<"Task", 'DateTime'>
    readonly endDate: FieldRef<"Task", 'DateTime'>
    readonly estimatedHours: FieldRef<"Task", 'Float'>
    readonly createdAt: FieldRef<"Task", 'DateTime'>
    readonly updatedAt: FieldRef<"Task", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * Task findUnique
   */
  export type TaskFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findUniqueOrThrow
   */
  export type TaskFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task findFirst
   */
  export type TaskFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findFirstOrThrow
   */
  export type TaskFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Task to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of Tasks.
     */
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task findMany
   */
  export type TaskFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter, which Tasks to fetch.
     */
    where?: TaskWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of Tasks to fetch.
     */
    orderBy?: TaskOrderByWithRelationInput | TaskOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing Tasks.
     */
    cursor?: TaskWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` Tasks from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` Tasks.
     */
    skip?: number
    distinct?: TaskScalarFieldEnum | TaskScalarFieldEnum[]
  }

  /**
   * Task create
   */
  export type TaskCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to create a Task.
     */
    data: XOR<TaskCreateInput, TaskUncheckedCreateInput>
  }

  /**
   * Task createMany
   */
  export type TaskCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many Tasks.
     */
    data: TaskCreateManyInput | TaskCreateManyInput[]
  }

  /**
   * Task update
   */
  export type TaskUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The data needed to update a Task.
     */
    data: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
    /**
     * Choose, which Task to update.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task updateMany
   */
  export type TaskUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update Tasks.
     */
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyInput>
    /**
     * Filter which Tasks to update
     */
    where?: TaskWhereInput
  }

  /**
   * Task upsert
   */
  export type TaskUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * The filter to search for the Task to update in case it exists.
     */
    where: TaskWhereUniqueInput
    /**
     * In case the Task found by the `where` argument doesn't exist, create a new Task with this data.
     */
    create: XOR<TaskCreateInput, TaskUncheckedCreateInput>
    /**
     * In case the Task was found with the provided `where` argument, update it with this data.
     */
    update: XOR<TaskUpdateInput, TaskUncheckedUpdateInput>
  }

  /**
   * Task delete
   */
  export type TaskDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
    /**
     * Filter which Task to delete.
     */
    where: TaskWhereUniqueInput
  }

  /**
   * Task deleteMany
   */
  export type TaskDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which Tasks to delete
     */
    where?: TaskWhereInput
  }

  /**
   * Task findRaw
   */
  export type TaskFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Task aggregateRaw
   */
  export type TaskAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * Task without action
   */
  export type TaskDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the Task
     */
    select?: TaskSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: TaskInclude<ExtArgs> | null
  }


  /**
   * Model ChatSession
   */

  export type AggregateChatSession = {
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  export type ChatSessionMinAggregateOutputType = {
    id: string | null
    userId: string | null
    context: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionMaxAggregateOutputType = {
    id: string | null
    userId: string | null
    context: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ChatSessionCountAggregateOutputType = {
    id: number
    userId: number
    context: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ChatSessionMinAggregateInputType = {
    id?: true
    userId?: true
    context?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionMaxAggregateInputType = {
    id?: true
    userId?: true
    context?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ChatSessionCountAggregateInputType = {
    id?: true
    userId?: true
    context?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ChatSessionAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSession to aggregate.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatSessions
    **/
    _count?: true | ChatSessionCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatSessionMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatSessionMaxAggregateInputType
  }

  export type GetChatSessionAggregateType<T extends ChatSessionAggregateArgs> = {
        [P in keyof T & keyof AggregateChatSession]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatSession[P]>
      : GetScalarType<T[P], AggregateChatSession[P]>
  }




  export type ChatSessionGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatSessionWhereInput
    orderBy?: ChatSessionOrderByWithAggregationInput | ChatSessionOrderByWithAggregationInput[]
    by: ChatSessionScalarFieldEnum[] | ChatSessionScalarFieldEnum
    having?: ChatSessionScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatSessionCountAggregateInputType | true
    _min?: ChatSessionMinAggregateInputType
    _max?: ChatSessionMaxAggregateInputType
  }

  export type ChatSessionGroupByOutputType = {
    id: string
    userId: string
    context: string
    createdAt: Date
    updatedAt: Date
    _count: ChatSessionCountAggregateOutputType | null
    _min: ChatSessionMinAggregateOutputType | null
    _max: ChatSessionMaxAggregateOutputType | null
  }

  type GetChatSessionGroupByPayload<T extends ChatSessionGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatSessionGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatSessionGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
            : GetScalarType<T[P], ChatSessionGroupByOutputType[P]>
        }
      >
    >


  export type ChatSessionSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    userId?: boolean
    context?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatSession"]>


  export type ChatSessionSelectScalar = {
    id?: boolean
    userId?: boolean
    context?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ChatSessionInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    messages?: boolean | ChatSession$messagesArgs<ExtArgs>
    user?: boolean | UserDefaultArgs<ExtArgs>
    _count?: boolean | ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ChatSessionPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatSession"
    objects: {
      messages: Prisma.$ChatMessagePayload<ExtArgs>[]
      user: Prisma.$UserPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      userId: string
      context: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["chatSession"]>
    composites: {}
  }

  type ChatSessionGetPayload<S extends boolean | null | undefined | ChatSessionDefaultArgs> = $Result.GetResult<Prisma.$ChatSessionPayload, S>

  type ChatSessionCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChatSessionFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChatSessionCountAggregateInputType | true
    }

  export interface ChatSessionDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatSession'], meta: { name: 'ChatSession' } }
    /**
     * Find zero or one ChatSession that matches the filter.
     * @param {ChatSessionFindUniqueArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatSessionFindUniqueArgs>(args: SelectSubset<T, ChatSessionFindUniqueArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChatSession that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChatSessionFindUniqueOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatSessionFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatSessionFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChatSession that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatSessionFindFirstArgs>(args?: SelectSubset<T, ChatSessionFindFirstArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChatSession that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindFirstOrThrowArgs} args - Arguments to find a ChatSession
     * @example
     * // Get one ChatSession
     * const chatSession = await prisma.chatSession.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatSessionFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatSessionFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChatSessions that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatSessions
     * const chatSessions = await prisma.chatSession.findMany()
     * 
     * // Get first 10 ChatSessions
     * const chatSessions = await prisma.chatSession.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatSessionWithIdOnly = await prisma.chatSession.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatSessionFindManyArgs>(args?: SelectSubset<T, ChatSessionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChatSession.
     * @param {ChatSessionCreateArgs} args - Arguments to create a ChatSession.
     * @example
     * // Create one ChatSession
     * const ChatSession = await prisma.chatSession.create({
     *   data: {
     *     // ... data to create a ChatSession
     *   }
     * })
     * 
     */
    create<T extends ChatSessionCreateArgs>(args: SelectSubset<T, ChatSessionCreateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChatSessions.
     * @param {ChatSessionCreateManyArgs} args - Arguments to create many ChatSessions.
     * @example
     * // Create many ChatSessions
     * const chatSession = await prisma.chatSession.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatSessionCreateManyArgs>(args?: SelectSubset<T, ChatSessionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatSession.
     * @param {ChatSessionDeleteArgs} args - Arguments to delete one ChatSession.
     * @example
     * // Delete one ChatSession
     * const ChatSession = await prisma.chatSession.delete({
     *   where: {
     *     // ... filter to delete one ChatSession
     *   }
     * })
     * 
     */
    delete<T extends ChatSessionDeleteArgs>(args: SelectSubset<T, ChatSessionDeleteArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChatSession.
     * @param {ChatSessionUpdateArgs} args - Arguments to update one ChatSession.
     * @example
     * // Update one ChatSession
     * const chatSession = await prisma.chatSession.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatSessionUpdateArgs>(args: SelectSubset<T, ChatSessionUpdateArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChatSessions.
     * @param {ChatSessionDeleteManyArgs} args - Arguments to filter ChatSessions to delete.
     * @example
     * // Delete a few ChatSessions
     * const { count } = await prisma.chatSession.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatSessionDeleteManyArgs>(args?: SelectSubset<T, ChatSessionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatSessions
     * const chatSession = await prisma.chatSession.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatSessionUpdateManyArgs>(args: SelectSubset<T, ChatSessionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatSession.
     * @param {ChatSessionUpsertArgs} args - Arguments to update or create a ChatSession.
     * @example
     * // Update or create a ChatSession
     * const chatSession = await prisma.chatSession.upsert({
     *   create: {
     *     // ... data to create a ChatSession
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatSession we want to update
     *   }
     * })
     */
    upsert<T extends ChatSessionUpsertArgs>(args: SelectSubset<T, ChatSessionUpsertArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more ChatSessions that matches the filter.
     * @param {ChatSessionFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const chatSession = await prisma.chatSession.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: ChatSessionFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a ChatSession.
     * @param {ChatSessionAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const chatSession = await prisma.chatSession.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ChatSessionAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of ChatSessions.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionCountArgs} args - Arguments to filter ChatSessions to count.
     * @example
     * // Count the number of ChatSessions
     * const count = await prisma.chatSession.count({
     *   where: {
     *     // ... the filter for the ChatSessions we want to count
     *   }
     * })
    **/
    count<T extends ChatSessionCountArgs>(
      args?: Subset<T, ChatSessionCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatSessionCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatSessionAggregateArgs>(args: Subset<T, ChatSessionAggregateArgs>): Prisma.PrismaPromise<GetChatSessionAggregateType<T>>

    /**
     * Group by ChatSession.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatSessionGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatSessionGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatSessionGroupByArgs['orderBy'] }
        : { orderBy?: ChatSessionGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatSessionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatSessionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatSession model
   */
  readonly fields: ChatSessionFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatSession.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatSessionClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    messages<T extends ChatSession$messagesArgs<ExtArgs> = {}>(args?: Subset<T, ChatSession$messagesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany"> | Null>
    user<T extends UserDefaultArgs<ExtArgs> = {}>(args?: Subset<T, UserDefaultArgs<ExtArgs>>): Prisma__UserClient<$Result.GetResult<Prisma.$UserPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatSession model
   */ 
  interface ChatSessionFieldRefs {
    readonly id: FieldRef<"ChatSession", 'String'>
    readonly userId: FieldRef<"ChatSession", 'String'>
    readonly context: FieldRef<"ChatSession", 'String'>
    readonly createdAt: FieldRef<"ChatSession", 'DateTime'>
    readonly updatedAt: FieldRef<"ChatSession", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatSession findUnique
   */
  export type ChatSessionFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findUniqueOrThrow
   */
  export type ChatSessionFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession findFirst
   */
  export type ChatSessionFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findFirstOrThrow
   */
  export type ChatSessionFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSession to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatSessions.
     */
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession findMany
   */
  export type ChatSessionFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter, which ChatSessions to fetch.
     */
    where?: ChatSessionWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatSessions to fetch.
     */
    orderBy?: ChatSessionOrderByWithRelationInput | ChatSessionOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatSessions.
     */
    cursor?: ChatSessionWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatSessions from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatSessions.
     */
    skip?: number
    distinct?: ChatSessionScalarFieldEnum | ChatSessionScalarFieldEnum[]
  }

  /**
   * ChatSession create
   */
  export type ChatSessionCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatSession.
     */
    data: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
  }

  /**
   * ChatSession createMany
   */
  export type ChatSessionCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatSessions.
     */
    data: ChatSessionCreateManyInput | ChatSessionCreateManyInput[]
  }

  /**
   * ChatSession update
   */
  export type ChatSessionUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatSession.
     */
    data: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
    /**
     * Choose, which ChatSession to update.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession updateMany
   */
  export type ChatSessionUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatSessions.
     */
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyInput>
    /**
     * Filter which ChatSessions to update
     */
    where?: ChatSessionWhereInput
  }

  /**
   * ChatSession upsert
   */
  export type ChatSessionUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatSession to update in case it exists.
     */
    where: ChatSessionWhereUniqueInput
    /**
     * In case the ChatSession found by the `where` argument doesn't exist, create a new ChatSession with this data.
     */
    create: XOR<ChatSessionCreateInput, ChatSessionUncheckedCreateInput>
    /**
     * In case the ChatSession was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatSessionUpdateInput, ChatSessionUncheckedUpdateInput>
  }

  /**
   * ChatSession delete
   */
  export type ChatSessionDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
    /**
     * Filter which ChatSession to delete.
     */
    where: ChatSessionWhereUniqueInput
  }

  /**
   * ChatSession deleteMany
   */
  export type ChatSessionDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatSessions to delete
     */
    where?: ChatSessionWhereInput
  }

  /**
   * ChatSession findRaw
   */
  export type ChatSessionFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ChatSession aggregateRaw
   */
  export type ChatSessionAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ChatSession.messages
   */
  export type ChatSession$messagesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    cursor?: ChatMessageWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatSession without action
   */
  export type ChatSessionDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatSession
     */
    select?: ChatSessionSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatSessionInclude<ExtArgs> | null
  }


  /**
   * Model ChatMessage
   */

  export type AggregateChatMessage = {
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  export type ChatMessageMinAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageMaxAggregateOutputType = {
    id: string | null
    sessionId: string | null
    role: string | null
    content: string | null
    createdAt: Date | null
  }

  export type ChatMessageCountAggregateOutputType = {
    id: number
    sessionId: number
    role: number
    content: number
    createdAt: number
    _all: number
  }


  export type ChatMessageMinAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageMaxAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    createdAt?: true
  }

  export type ChatMessageCountAggregateInputType = {
    id?: true
    sessionId?: true
    role?: true
    content?: true
    createdAt?: true
    _all?: true
  }

  export type ChatMessageAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessage to aggregate.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ChatMessages
    **/
    _count?: true | ChatMessageCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ChatMessageMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ChatMessageMaxAggregateInputType
  }

  export type GetChatMessageAggregateType<T extends ChatMessageAggregateArgs> = {
        [P in keyof T & keyof AggregateChatMessage]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateChatMessage[P]>
      : GetScalarType<T[P], AggregateChatMessage[P]>
  }




  export type ChatMessageGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ChatMessageWhereInput
    orderBy?: ChatMessageOrderByWithAggregationInput | ChatMessageOrderByWithAggregationInput[]
    by: ChatMessageScalarFieldEnum[] | ChatMessageScalarFieldEnum
    having?: ChatMessageScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ChatMessageCountAggregateInputType | true
    _min?: ChatMessageMinAggregateInputType
    _max?: ChatMessageMaxAggregateInputType
  }

  export type ChatMessageGroupByOutputType = {
    id: string
    sessionId: string
    role: string
    content: string
    createdAt: Date
    _count: ChatMessageCountAggregateOutputType | null
    _min: ChatMessageMinAggregateOutputType | null
    _max: ChatMessageMaxAggregateOutputType | null
  }

  type GetChatMessageGroupByPayload<T extends ChatMessageGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ChatMessageGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ChatMessageGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
            : GetScalarType<T[P], ChatMessageGroupByOutputType[P]>
        }
      >
    >


  export type ChatMessageSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["chatMessage"]>


  export type ChatMessageSelectScalar = {
    id?: boolean
    sessionId?: boolean
    role?: boolean
    content?: boolean
    createdAt?: boolean
  }

  export type ChatMessageInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    session?: boolean | ChatSessionDefaultArgs<ExtArgs>
  }

  export type $ChatMessagePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ChatMessage"
    objects: {
      session: Prisma.$ChatSessionPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: string
      sessionId: string
      role: string
      content: string
      createdAt: Date
    }, ExtArgs["result"]["chatMessage"]>
    composites: {}
  }

  type ChatMessageGetPayload<S extends boolean | null | undefined | ChatMessageDefaultArgs> = $Result.GetResult<Prisma.$ChatMessagePayload, S>

  type ChatMessageCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = 
    Omit<ChatMessageFindManyArgs, 'select' | 'include' | 'distinct'> & {
      select?: ChatMessageCountAggregateInputType | true
    }

  export interface ChatMessageDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ChatMessage'], meta: { name: 'ChatMessage' } }
    /**
     * Find zero or one ChatMessage that matches the filter.
     * @param {ChatMessageFindUniqueArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ChatMessageFindUniqueArgs>(args: SelectSubset<T, ChatMessageFindUniqueArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUnique"> | null, null, ExtArgs>

    /**
     * Find one ChatMessage that matches the filter or throw an error with `error.code='P2025'` 
     * if no matches were found.
     * @param {ChatMessageFindUniqueOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ChatMessageFindUniqueOrThrowArgs>(args: SelectSubset<T, ChatMessageFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findUniqueOrThrow">, never, ExtArgs>

    /**
     * Find the first ChatMessage that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ChatMessageFindFirstArgs>(args?: SelectSubset<T, ChatMessageFindFirstArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirst"> | null, null, ExtArgs>

    /**
     * Find the first ChatMessage that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindFirstOrThrowArgs} args - Arguments to find a ChatMessage
     * @example
     * // Get one ChatMessage
     * const chatMessage = await prisma.chatMessage.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ChatMessageFindFirstOrThrowArgs>(args?: SelectSubset<T, ChatMessageFindFirstOrThrowArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findFirstOrThrow">, never, ExtArgs>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany()
     * 
     * // Get first 10 ChatMessages
     * const chatMessages = await prisma.chatMessage.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const chatMessageWithIdOnly = await prisma.chatMessage.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ChatMessageFindManyArgs>(args?: SelectSubset<T, ChatMessageFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "findMany">>

    /**
     * Create a ChatMessage.
     * @param {ChatMessageCreateArgs} args - Arguments to create a ChatMessage.
     * @example
     * // Create one ChatMessage
     * const ChatMessage = await prisma.chatMessage.create({
     *   data: {
     *     // ... data to create a ChatMessage
     *   }
     * })
     * 
     */
    create<T extends ChatMessageCreateArgs>(args: SelectSubset<T, ChatMessageCreateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "create">, never, ExtArgs>

    /**
     * Create many ChatMessages.
     * @param {ChatMessageCreateManyArgs} args - Arguments to create many ChatMessages.
     * @example
     * // Create many ChatMessages
     * const chatMessage = await prisma.chatMessage.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ChatMessageCreateManyArgs>(args?: SelectSubset<T, ChatMessageCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ChatMessage.
     * @param {ChatMessageDeleteArgs} args - Arguments to delete one ChatMessage.
     * @example
     * // Delete one ChatMessage
     * const ChatMessage = await prisma.chatMessage.delete({
     *   where: {
     *     // ... filter to delete one ChatMessage
     *   }
     * })
     * 
     */
    delete<T extends ChatMessageDeleteArgs>(args: SelectSubset<T, ChatMessageDeleteArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "delete">, never, ExtArgs>

    /**
     * Update one ChatMessage.
     * @param {ChatMessageUpdateArgs} args - Arguments to update one ChatMessage.
     * @example
     * // Update one ChatMessage
     * const chatMessage = await prisma.chatMessage.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ChatMessageUpdateArgs>(args: SelectSubset<T, ChatMessageUpdateArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "update">, never, ExtArgs>

    /**
     * Delete zero or more ChatMessages.
     * @param {ChatMessageDeleteManyArgs} args - Arguments to filter ChatMessages to delete.
     * @example
     * // Delete a few ChatMessages
     * const { count } = await prisma.chatMessage.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ChatMessageDeleteManyArgs>(args?: SelectSubset<T, ChatMessageDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ChatMessages
     * const chatMessage = await prisma.chatMessage.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ChatMessageUpdateManyArgs>(args: SelectSubset<T, ChatMessageUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ChatMessage.
     * @param {ChatMessageUpsertArgs} args - Arguments to update or create a ChatMessage.
     * @example
     * // Update or create a ChatMessage
     * const chatMessage = await prisma.chatMessage.upsert({
     *   create: {
     *     // ... data to create a ChatMessage
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ChatMessage we want to update
     *   }
     * })
     */
    upsert<T extends ChatMessageUpsertArgs>(args: SelectSubset<T, ChatMessageUpsertArgs<ExtArgs>>): Prisma__ChatMessageClient<$Result.GetResult<Prisma.$ChatMessagePayload<ExtArgs>, T, "upsert">, never, ExtArgs>

    /**
     * Find zero or more ChatMessages that matches the filter.
     * @param {ChatMessageFindRawArgs} args - Select which filters you would like to apply.
     * @example
     * const chatMessage = await prisma.chatMessage.findRaw({
     *   filter: { age: { $gt: 25 } } 
     * })
     */
    findRaw(args?: ChatMessageFindRawArgs): Prisma.PrismaPromise<JsonObject>

    /**
     * Perform aggregation operations on a ChatMessage.
     * @param {ChatMessageAggregateRawArgs} args - Select which aggregations you would like to apply.
     * @example
     * const chatMessage = await prisma.chatMessage.aggregateRaw({
     *   pipeline: [
     *     { $match: { status: "registered" } },
     *     { $group: { _id: "$country", total: { $sum: 1 } } }
     *   ]
     * })
     */
    aggregateRaw(args?: ChatMessageAggregateRawArgs): Prisma.PrismaPromise<JsonObject>


    /**
     * Count the number of ChatMessages.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageCountArgs} args - Arguments to filter ChatMessages to count.
     * @example
     * // Count the number of ChatMessages
     * const count = await prisma.chatMessage.count({
     *   where: {
     *     // ... the filter for the ChatMessages we want to count
     *   }
     * })
    **/
    count<T extends ChatMessageCountArgs>(
      args?: Subset<T, ChatMessageCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ChatMessageCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ChatMessageAggregateArgs>(args: Subset<T, ChatMessageAggregateArgs>): Prisma.PrismaPromise<GetChatMessageAggregateType<T>>

    /**
     * Group by ChatMessage.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ChatMessageGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ChatMessageGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ChatMessageGroupByArgs['orderBy'] }
        : { orderBy?: ChatMessageGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ChatMessageGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetChatMessageGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ChatMessage model
   */
  readonly fields: ChatMessageFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ChatMessage.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ChatMessageClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    session<T extends ChatSessionDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ChatSessionDefaultArgs<ExtArgs>>): Prisma__ChatSessionClient<$Result.GetResult<Prisma.$ChatSessionPayload<ExtArgs>, T, "findUniqueOrThrow"> | Null, Null, ExtArgs>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ChatMessage model
   */ 
  interface ChatMessageFieldRefs {
    readonly id: FieldRef<"ChatMessage", 'String'>
    readonly sessionId: FieldRef<"ChatMessage", 'String'>
    readonly role: FieldRef<"ChatMessage", 'String'>
    readonly content: FieldRef<"ChatMessage", 'String'>
    readonly createdAt: FieldRef<"ChatMessage", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ChatMessage findUnique
   */
  export type ChatMessageFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findUniqueOrThrow
   */
  export type ChatMessageFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage findFirst
   */
  export type ChatMessageFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findFirstOrThrow
   */
  export type ChatMessageFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessage to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ChatMessages.
     */
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage findMany
   */
  export type ChatMessageFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter, which ChatMessages to fetch.
     */
    where?: ChatMessageWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ChatMessages to fetch.
     */
    orderBy?: ChatMessageOrderByWithRelationInput | ChatMessageOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ChatMessages.
     */
    cursor?: ChatMessageWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ChatMessages from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ChatMessages.
     */
    skip?: number
    distinct?: ChatMessageScalarFieldEnum | ChatMessageScalarFieldEnum[]
  }

  /**
   * ChatMessage create
   */
  export type ChatMessageCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to create a ChatMessage.
     */
    data: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
  }

  /**
   * ChatMessage createMany
   */
  export type ChatMessageCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ChatMessages.
     */
    data: ChatMessageCreateManyInput | ChatMessageCreateManyInput[]
  }

  /**
   * ChatMessage update
   */
  export type ChatMessageUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The data needed to update a ChatMessage.
     */
    data: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
    /**
     * Choose, which ChatMessage to update.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage updateMany
   */
  export type ChatMessageUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ChatMessages.
     */
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyInput>
    /**
     * Filter which ChatMessages to update
     */
    where?: ChatMessageWhereInput
  }

  /**
   * ChatMessage upsert
   */
  export type ChatMessageUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * The filter to search for the ChatMessage to update in case it exists.
     */
    where: ChatMessageWhereUniqueInput
    /**
     * In case the ChatMessage found by the `where` argument doesn't exist, create a new ChatMessage with this data.
     */
    create: XOR<ChatMessageCreateInput, ChatMessageUncheckedCreateInput>
    /**
     * In case the ChatMessage was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ChatMessageUpdateInput, ChatMessageUncheckedUpdateInput>
  }

  /**
   * ChatMessage delete
   */
  export type ChatMessageDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
    /**
     * Filter which ChatMessage to delete.
     */
    where: ChatMessageWhereUniqueInput
  }

  /**
   * ChatMessage deleteMany
   */
  export type ChatMessageDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ChatMessages to delete
     */
    where?: ChatMessageWhereInput
  }

  /**
   * ChatMessage findRaw
   */
  export type ChatMessageFindRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The query predicate filter. If unspecified, then all documents in the collection will match the predicate. ${@link https://docs.mongodb.com/manual/reference/operator/query MongoDB Docs}.
     */
    filter?: InputJsonValue
    /**
     * Additional options to pass to the `find` command ${@link https://docs.mongodb.com/manual/reference/command/find/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ChatMessage aggregateRaw
   */
  export type ChatMessageAggregateRawArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * An array of aggregation stages to process and transform the document stream via the aggregation pipeline. ${@link https://docs.mongodb.com/manual/reference/operator/aggregation-pipeline MongoDB Docs}.
     */
    pipeline?: InputJsonValue[]
    /**
     * Additional options to pass to the `aggregate` command ${@link https://docs.mongodb.com/manual/reference/command/aggregate/#command-fields MongoDB Docs}.
     */
    options?: InputJsonValue
  }

  /**
   * ChatMessage without action
   */
  export type ChatMessageDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ChatMessage
     */
    select?: ChatMessageSelect<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ChatMessageInclude<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const UserScalarFieldEnum: {
    id: 'id',
    email: 'email',
    name: 'name',
    avatarUrl: 'avatarUrl',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type UserScalarFieldEnum = (typeof UserScalarFieldEnum)[keyof typeof UserScalarFieldEnum]


  export const DimensionScalarFieldEnum: {
    id: 'id',
    name: 'name',
    label: 'label',
    category: 'category',
    description: 'description',
    sortOrder: 'sortOrder',
    isActive: 'isActive',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type DimensionScalarFieldEnum = (typeof DimensionScalarFieldEnum)[keyof typeof DimensionScalarFieldEnum]


  export const UserAttributeScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    dimensionId: 'dimensionId',
    name: 'name',
    category: 'category',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type UserAttributeScalarFieldEnum = (typeof UserAttributeScalarFieldEnum)[keyof typeof UserAttributeScalarFieldEnum]


  export const DimensionInputScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    dimensionId: 'dimensionId',
    inputType: 'inputType',
    subType: 'subType',
    valueJson: 'valueJson',
    source: 'source',
    createdAt: 'createdAt'
  };

  export type DimensionInputScalarFieldEnum = (typeof DimensionInputScalarFieldEnum)[keyof typeof DimensionInputScalarFieldEnum]


  export const LifeStateScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    lifeScore: 'lifeScore',
    balanceScore: 'balanceScore',
    alignmentScore: 'alignmentScore',
    energyIndex: 'energyIndex',
    timestamp: 'timestamp',
    triggeredBy: 'triggeredBy',
    insights: 'insights'
  };

  export type LifeStateScalarFieldEnum = (typeof LifeStateScalarFieldEnum)[keyof typeof LifeStateScalarFieldEnum]


  export const LifeEventScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    type: 'type',
    title: 'title',
    description: 'description',
    date: 'date',
    impact: 'impact',
    metadata: 'metadata',
    createdAt: 'createdAt'
  };

  export type LifeEventScalarFieldEnum = (typeof LifeEventScalarFieldEnum)[keyof typeof LifeEventScalarFieldEnum]


  export const GoalScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    title: 'title',
    description: 'description',
    dimensionId: 'dimensionId',
    progress: 'progress',
    status: 'status',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GoalScalarFieldEnum = (typeof GoalScalarFieldEnum)[keyof typeof GoalScalarFieldEnum]


  export const GoalActionScalarFieldEnum: {
    id: 'id',
    goalId: 'goalId',
    title: 'title',
    description: 'description',
    isCompleted: 'isCompleted',
    targetDate: 'targetDate',
    dimensions: 'dimensions',
    attributes: 'attributes',
    impact: 'impact',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type GoalActionScalarFieldEnum = (typeof GoalActionScalarFieldEnum)[keyof typeof GoalActionScalarFieldEnum]


  export const TaskScalarFieldEnum: {
    id: 'id',
    goalActionId: 'goalActionId',
    title: 'title',
    description: 'description',
    isCompleted: 'isCompleted',
    startDate: 'startDate',
    endDate: 'endDate',
    estimatedHours: 'estimatedHours',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type TaskScalarFieldEnum = (typeof TaskScalarFieldEnum)[keyof typeof TaskScalarFieldEnum]


  export const ChatSessionScalarFieldEnum: {
    id: 'id',
    userId: 'userId',
    context: 'context',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ChatSessionScalarFieldEnum = (typeof ChatSessionScalarFieldEnum)[keyof typeof ChatSessionScalarFieldEnum]


  export const ChatMessageScalarFieldEnum: {
    id: 'id',
    sessionId: 'sessionId',
    role: 'role',
    content: 'content',
    createdAt: 'createdAt'
  };

  export type ChatMessageScalarFieldEnum = (typeof ChatMessageScalarFieldEnum)[keyof typeof ChatMessageScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  /**
   * Field references 
   */


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'String[]'
   */
  export type ListStringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String[]'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'DateTime[]'
   */
  export type ListDateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime[]'>
    


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'Int[]'
   */
  export type ListIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int[]'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    


  /**
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Float[]'
   */
  export type ListFloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float[]'>
    
  /**
   * Deep Input Types
   */


  export type UserWhereInput = {
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    id?: StringFilter<"User"> | string
    email?: StringFilter<"User"> | string
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    attributes?: UserAttributeListRelationFilter
    dimensionInputs?: DimensionInputListRelationFilter
    lifeStates?: LifeStateListRelationFilter
    lifeEvents?: LifeEventListRelationFilter
    goals?: GoalListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
  }

  export type UserOrderByWithRelationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    attributes?: UserAttributeOrderByRelationAggregateInput
    dimensionInputs?: DimensionInputOrderByRelationAggregateInput
    lifeStates?: LifeStateOrderByRelationAggregateInput
    lifeEvents?: LifeEventOrderByRelationAggregateInput
    goals?: GoalOrderByRelationAggregateInput
    chatSessions?: ChatSessionOrderByRelationAggregateInput
  }

  export type UserWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    email?: string
    AND?: UserWhereInput | UserWhereInput[]
    OR?: UserWhereInput[]
    NOT?: UserWhereInput | UserWhereInput[]
    name?: StringNullableFilter<"User"> | string | null
    avatarUrl?: StringNullableFilter<"User"> | string | null
    createdAt?: DateTimeFilter<"User"> | Date | string
    updatedAt?: DateTimeFilter<"User"> | Date | string
    attributes?: UserAttributeListRelationFilter
    dimensionInputs?: DimensionInputListRelationFilter
    lifeStates?: LifeStateListRelationFilter
    lifeEvents?: LifeEventListRelationFilter
    goals?: GoalListRelationFilter
    chatSessions?: ChatSessionListRelationFilter
  }, "id" | "email">

  export type UserOrderByWithAggregationInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: UserCountOrderByAggregateInput
    _max?: UserMaxOrderByAggregateInput
    _min?: UserMinOrderByAggregateInput
  }

  export type UserScalarWhereWithAggregatesInput = {
    AND?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    OR?: UserScalarWhereWithAggregatesInput[]
    NOT?: UserScalarWhereWithAggregatesInput | UserScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"User"> | string
    email?: StringWithAggregatesFilter<"User"> | string
    name?: StringNullableWithAggregatesFilter<"User"> | string | null
    avatarUrl?: StringNullableWithAggregatesFilter<"User"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"User"> | Date | string
  }

  export type DimensionWhereInput = {
    AND?: DimensionWhereInput | DimensionWhereInput[]
    OR?: DimensionWhereInput[]
    NOT?: DimensionWhereInput | DimensionWhereInput[]
    id?: StringFilter<"Dimension"> | string
    name?: StringFilter<"Dimension"> | string
    label?: StringFilter<"Dimension"> | string
    category?: StringFilter<"Dimension"> | string
    description?: StringNullableFilter<"Dimension"> | string | null
    sortOrder?: IntFilter<"Dimension"> | number
    isActive?: BoolFilter<"Dimension"> | boolean
    createdAt?: DateTimeFilter<"Dimension"> | Date | string
    updatedAt?: DateTimeFilter<"Dimension"> | Date | string
    attributes?: UserAttributeListRelationFilter
    dimensionInputs?: DimensionInputListRelationFilter
  }

  export type DimensionOrderByWithRelationInput = {
    id?: SortOrder
    name?: SortOrder
    label?: SortOrder
    category?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    attributes?: UserAttributeOrderByRelationAggregateInput
    dimensionInputs?: DimensionInputOrderByRelationAggregateInput
  }

  export type DimensionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    name?: string
    AND?: DimensionWhereInput | DimensionWhereInput[]
    OR?: DimensionWhereInput[]
    NOT?: DimensionWhereInput | DimensionWhereInput[]
    label?: StringFilter<"Dimension"> | string
    category?: StringFilter<"Dimension"> | string
    description?: StringNullableFilter<"Dimension"> | string | null
    sortOrder?: IntFilter<"Dimension"> | number
    isActive?: BoolFilter<"Dimension"> | boolean
    createdAt?: DateTimeFilter<"Dimension"> | Date | string
    updatedAt?: DateTimeFilter<"Dimension"> | Date | string
    attributes?: UserAttributeListRelationFilter
    dimensionInputs?: DimensionInputListRelationFilter
  }, "id" | "name">

  export type DimensionOrderByWithAggregationInput = {
    id?: SortOrder
    name?: SortOrder
    label?: SortOrder
    category?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: DimensionCountOrderByAggregateInput
    _avg?: DimensionAvgOrderByAggregateInput
    _max?: DimensionMaxOrderByAggregateInput
    _min?: DimensionMinOrderByAggregateInput
    _sum?: DimensionSumOrderByAggregateInput
  }

  export type DimensionScalarWhereWithAggregatesInput = {
    AND?: DimensionScalarWhereWithAggregatesInput | DimensionScalarWhereWithAggregatesInput[]
    OR?: DimensionScalarWhereWithAggregatesInput[]
    NOT?: DimensionScalarWhereWithAggregatesInput | DimensionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Dimension"> | string
    name?: StringWithAggregatesFilter<"Dimension"> | string
    label?: StringWithAggregatesFilter<"Dimension"> | string
    category?: StringWithAggregatesFilter<"Dimension"> | string
    description?: StringNullableWithAggregatesFilter<"Dimension"> | string | null
    sortOrder?: IntWithAggregatesFilter<"Dimension"> | number
    isActive?: BoolWithAggregatesFilter<"Dimension"> | boolean
    createdAt?: DateTimeWithAggregatesFilter<"Dimension"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"Dimension"> | Date | string
  }

  export type UserAttributeWhereInput = {
    AND?: UserAttributeWhereInput | UserAttributeWhereInput[]
    OR?: UserAttributeWhereInput[]
    NOT?: UserAttributeWhereInput | UserAttributeWhereInput[]
    id?: StringFilter<"UserAttribute"> | string
    userId?: StringFilter<"UserAttribute"> | string
    dimensionId?: StringFilter<"UserAttribute"> | string
    name?: StringFilter<"UserAttribute"> | string
    category?: StringFilter<"UserAttribute"> | string
    metadata?: JsonNullableFilter<"UserAttribute">
    createdAt?: DateTimeFilter<"UserAttribute"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    dimension?: XOR<DimensionRelationFilter, DimensionWhereInput>
  }

  export type UserAttributeOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    dimension?: DimensionOrderByWithRelationInput
  }

  export type UserAttributeWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: UserAttributeWhereInput | UserAttributeWhereInput[]
    OR?: UserAttributeWhereInput[]
    NOT?: UserAttributeWhereInput | UserAttributeWhereInput[]
    userId?: StringFilter<"UserAttribute"> | string
    dimensionId?: StringFilter<"UserAttribute"> | string
    name?: StringFilter<"UserAttribute"> | string
    category?: StringFilter<"UserAttribute"> | string
    metadata?: JsonNullableFilter<"UserAttribute">
    createdAt?: DateTimeFilter<"UserAttribute"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    dimension?: XOR<DimensionRelationFilter, DimensionWhereInput>
  }, "id">

  export type UserAttributeOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    _count?: UserAttributeCountOrderByAggregateInput
    _max?: UserAttributeMaxOrderByAggregateInput
    _min?: UserAttributeMinOrderByAggregateInput
  }

  export type UserAttributeScalarWhereWithAggregatesInput = {
    AND?: UserAttributeScalarWhereWithAggregatesInput | UserAttributeScalarWhereWithAggregatesInput[]
    OR?: UserAttributeScalarWhereWithAggregatesInput[]
    NOT?: UserAttributeScalarWhereWithAggregatesInput | UserAttributeScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"UserAttribute"> | string
    userId?: StringWithAggregatesFilter<"UserAttribute"> | string
    dimensionId?: StringWithAggregatesFilter<"UserAttribute"> | string
    name?: StringWithAggregatesFilter<"UserAttribute"> | string
    category?: StringWithAggregatesFilter<"UserAttribute"> | string
    metadata?: JsonNullableWithAggregatesFilter<"UserAttribute">
    createdAt?: DateTimeWithAggregatesFilter<"UserAttribute"> | Date | string
  }

  export type DimensionInputWhereInput = {
    AND?: DimensionInputWhereInput | DimensionInputWhereInput[]
    OR?: DimensionInputWhereInput[]
    NOT?: DimensionInputWhereInput | DimensionInputWhereInput[]
    id?: StringFilter<"DimensionInput"> | string
    userId?: StringFilter<"DimensionInput"> | string
    dimensionId?: StringFilter<"DimensionInput"> | string
    inputType?: StringFilter<"DimensionInput"> | string
    subType?: StringNullableFilter<"DimensionInput"> | string | null
    valueJson?: JsonFilter<"DimensionInput">
    source?: StringFilter<"DimensionInput"> | string
    createdAt?: DateTimeFilter<"DimensionInput"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    dimension?: XOR<DimensionRelationFilter, DimensionWhereInput>
  }

  export type DimensionInputOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    inputType?: SortOrder
    subType?: SortOrder
    valueJson?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
    dimension?: DimensionOrderByWithRelationInput
  }

  export type DimensionInputWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: DimensionInputWhereInput | DimensionInputWhereInput[]
    OR?: DimensionInputWhereInput[]
    NOT?: DimensionInputWhereInput | DimensionInputWhereInput[]
    userId?: StringFilter<"DimensionInput"> | string
    dimensionId?: StringFilter<"DimensionInput"> | string
    inputType?: StringFilter<"DimensionInput"> | string
    subType?: StringNullableFilter<"DimensionInput"> | string | null
    valueJson?: JsonFilter<"DimensionInput">
    source?: StringFilter<"DimensionInput"> | string
    createdAt?: DateTimeFilter<"DimensionInput"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
    dimension?: XOR<DimensionRelationFilter, DimensionWhereInput>
  }, "id">

  export type DimensionInputOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    inputType?: SortOrder
    subType?: SortOrder
    valueJson?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
    _count?: DimensionInputCountOrderByAggregateInput
    _max?: DimensionInputMaxOrderByAggregateInput
    _min?: DimensionInputMinOrderByAggregateInput
  }

  export type DimensionInputScalarWhereWithAggregatesInput = {
    AND?: DimensionInputScalarWhereWithAggregatesInput | DimensionInputScalarWhereWithAggregatesInput[]
    OR?: DimensionInputScalarWhereWithAggregatesInput[]
    NOT?: DimensionInputScalarWhereWithAggregatesInput | DimensionInputScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"DimensionInput"> | string
    userId?: StringWithAggregatesFilter<"DimensionInput"> | string
    dimensionId?: StringWithAggregatesFilter<"DimensionInput"> | string
    inputType?: StringWithAggregatesFilter<"DimensionInput"> | string
    subType?: StringNullableWithAggregatesFilter<"DimensionInput"> | string | null
    valueJson?: JsonWithAggregatesFilter<"DimensionInput">
    source?: StringWithAggregatesFilter<"DimensionInput"> | string
    createdAt?: DateTimeWithAggregatesFilter<"DimensionInput"> | Date | string
  }

  export type LifeStateWhereInput = {
    AND?: LifeStateWhereInput | LifeStateWhereInput[]
    OR?: LifeStateWhereInput[]
    NOT?: LifeStateWhereInput | LifeStateWhereInput[]
    id?: StringFilter<"LifeState"> | string
    userId?: StringFilter<"LifeState"> | string
    lifeScore?: FloatFilter<"LifeState"> | number
    balanceScore?: FloatFilter<"LifeState"> | number
    alignmentScore?: FloatFilter<"LifeState"> | number
    energyIndex?: FloatFilter<"LifeState"> | number
    timestamp?: DateTimeFilter<"LifeState"> | Date | string
    triggeredBy?: StringNullableFilter<"LifeState"> | string | null
    insights?: JsonNullableFilter<"LifeState">
    scores?: DimensionScoreCompositeListFilter | DimensionScoreObjectEqualityInput[]
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type LifeStateOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    lifeScore?: SortOrder
    balanceScore?: SortOrder
    alignmentScore?: SortOrder
    energyIndex?: SortOrder
    timestamp?: SortOrder
    triggeredBy?: SortOrder
    insights?: SortOrder
    scores?: DimensionScoreOrderByCompositeAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type LifeStateWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LifeStateWhereInput | LifeStateWhereInput[]
    OR?: LifeStateWhereInput[]
    NOT?: LifeStateWhereInput | LifeStateWhereInput[]
    userId?: StringFilter<"LifeState"> | string
    lifeScore?: FloatFilter<"LifeState"> | number
    balanceScore?: FloatFilter<"LifeState"> | number
    alignmentScore?: FloatFilter<"LifeState"> | number
    energyIndex?: FloatFilter<"LifeState"> | number
    timestamp?: DateTimeFilter<"LifeState"> | Date | string
    triggeredBy?: StringNullableFilter<"LifeState"> | string | null
    insights?: JsonNullableFilter<"LifeState">
    scores?: DimensionScoreCompositeListFilter | DimensionScoreObjectEqualityInput[]
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type LifeStateOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    lifeScore?: SortOrder
    balanceScore?: SortOrder
    alignmentScore?: SortOrder
    energyIndex?: SortOrder
    timestamp?: SortOrder
    triggeredBy?: SortOrder
    insights?: SortOrder
    _count?: LifeStateCountOrderByAggregateInput
    _avg?: LifeStateAvgOrderByAggregateInput
    _max?: LifeStateMaxOrderByAggregateInput
    _min?: LifeStateMinOrderByAggregateInput
    _sum?: LifeStateSumOrderByAggregateInput
  }

  export type LifeStateScalarWhereWithAggregatesInput = {
    AND?: LifeStateScalarWhereWithAggregatesInput | LifeStateScalarWhereWithAggregatesInput[]
    OR?: LifeStateScalarWhereWithAggregatesInput[]
    NOT?: LifeStateScalarWhereWithAggregatesInput | LifeStateScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LifeState"> | string
    userId?: StringWithAggregatesFilter<"LifeState"> | string
    lifeScore?: FloatWithAggregatesFilter<"LifeState"> | number
    balanceScore?: FloatWithAggregatesFilter<"LifeState"> | number
    alignmentScore?: FloatWithAggregatesFilter<"LifeState"> | number
    energyIndex?: FloatWithAggregatesFilter<"LifeState"> | number
    timestamp?: DateTimeWithAggregatesFilter<"LifeState"> | Date | string
    triggeredBy?: StringNullableWithAggregatesFilter<"LifeState"> | string | null
    insights?: JsonNullableWithAggregatesFilter<"LifeState">
  }

  export type LifeEventWhereInput = {
    AND?: LifeEventWhereInput | LifeEventWhereInput[]
    OR?: LifeEventWhereInput[]
    NOT?: LifeEventWhereInput | LifeEventWhereInput[]
    id?: StringFilter<"LifeEvent"> | string
    userId?: StringFilter<"LifeEvent"> | string
    type?: StringFilter<"LifeEvent"> | string
    title?: StringFilter<"LifeEvent"> | string
    description?: StringNullableFilter<"LifeEvent"> | string | null
    date?: DateTimeFilter<"LifeEvent"> | Date | string
    impact?: JsonNullableFilter<"LifeEvent">
    metadata?: JsonNullableFilter<"LifeEvent">
    createdAt?: DateTimeFilter<"LifeEvent"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type LifeEventOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    impact?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    user?: UserOrderByWithRelationInput
  }

  export type LifeEventWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: LifeEventWhereInput | LifeEventWhereInput[]
    OR?: LifeEventWhereInput[]
    NOT?: LifeEventWhereInput | LifeEventWhereInput[]
    userId?: StringFilter<"LifeEvent"> | string
    type?: StringFilter<"LifeEvent"> | string
    title?: StringFilter<"LifeEvent"> | string
    description?: StringNullableFilter<"LifeEvent"> | string | null
    date?: DateTimeFilter<"LifeEvent"> | Date | string
    impact?: JsonNullableFilter<"LifeEvent">
    metadata?: JsonNullableFilter<"LifeEvent">
    createdAt?: DateTimeFilter<"LifeEvent"> | Date | string
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type LifeEventOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    impact?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
    _count?: LifeEventCountOrderByAggregateInput
    _max?: LifeEventMaxOrderByAggregateInput
    _min?: LifeEventMinOrderByAggregateInput
  }

  export type LifeEventScalarWhereWithAggregatesInput = {
    AND?: LifeEventScalarWhereWithAggregatesInput | LifeEventScalarWhereWithAggregatesInput[]
    OR?: LifeEventScalarWhereWithAggregatesInput[]
    NOT?: LifeEventScalarWhereWithAggregatesInput | LifeEventScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"LifeEvent"> | string
    userId?: StringWithAggregatesFilter<"LifeEvent"> | string
    type?: StringWithAggregatesFilter<"LifeEvent"> | string
    title?: StringWithAggregatesFilter<"LifeEvent"> | string
    description?: StringNullableWithAggregatesFilter<"LifeEvent"> | string | null
    date?: DateTimeWithAggregatesFilter<"LifeEvent"> | Date | string
    impact?: JsonNullableWithAggregatesFilter<"LifeEvent">
    metadata?: JsonNullableWithAggregatesFilter<"LifeEvent">
    createdAt?: DateTimeWithAggregatesFilter<"LifeEvent"> | Date | string
  }

  export type GoalWhereInput = {
    AND?: GoalWhereInput | GoalWhereInput[]
    OR?: GoalWhereInput[]
    NOT?: GoalWhereInput | GoalWhereInput[]
    id?: StringFilter<"Goal"> | string
    userId?: StringFilter<"Goal"> | string
    title?: StringFilter<"Goal"> | string
    description?: StringNullableFilter<"Goal"> | string | null
    dimensionId?: StringNullableFilter<"Goal"> | string | null
    progress?: FloatFilter<"Goal"> | number
    status?: StringFilter<"Goal"> | string
    createdAt?: DateTimeFilter<"Goal"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Goal"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    actions?: GoalActionListRelationFilter
  }

  export type GoalOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    dimensionId?: SortOrder
    progress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    user?: UserOrderByWithRelationInput
    actions?: GoalActionOrderByRelationAggregateInput
  }

  export type GoalWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GoalWhereInput | GoalWhereInput[]
    OR?: GoalWhereInput[]
    NOT?: GoalWhereInput | GoalWhereInput[]
    userId?: StringFilter<"Goal"> | string
    title?: StringFilter<"Goal"> | string
    description?: StringNullableFilter<"Goal"> | string | null
    dimensionId?: StringNullableFilter<"Goal"> | string | null
    progress?: FloatFilter<"Goal"> | number
    status?: StringFilter<"Goal"> | string
    createdAt?: DateTimeFilter<"Goal"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Goal"> | Date | string | null
    user?: XOR<UserRelationFilter, UserWhereInput>
    actions?: GoalActionListRelationFilter
  }, "id">

  export type GoalOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    dimensionId?: SortOrder
    progress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GoalCountOrderByAggregateInput
    _avg?: GoalAvgOrderByAggregateInput
    _max?: GoalMaxOrderByAggregateInput
    _min?: GoalMinOrderByAggregateInput
    _sum?: GoalSumOrderByAggregateInput
  }

  export type GoalScalarWhereWithAggregatesInput = {
    AND?: GoalScalarWhereWithAggregatesInput | GoalScalarWhereWithAggregatesInput[]
    OR?: GoalScalarWhereWithAggregatesInput[]
    NOT?: GoalScalarWhereWithAggregatesInput | GoalScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Goal"> | string
    userId?: StringWithAggregatesFilter<"Goal"> | string
    title?: StringWithAggregatesFilter<"Goal"> | string
    description?: StringNullableWithAggregatesFilter<"Goal"> | string | null
    dimensionId?: StringNullableWithAggregatesFilter<"Goal"> | string | null
    progress?: FloatWithAggregatesFilter<"Goal"> | number
    status?: StringWithAggregatesFilter<"Goal"> | string
    createdAt?: DateTimeWithAggregatesFilter<"Goal"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Goal"> | Date | string | null
  }

  export type GoalActionWhereInput = {
    AND?: GoalActionWhereInput | GoalActionWhereInput[]
    OR?: GoalActionWhereInput[]
    NOT?: GoalActionWhereInput | GoalActionWhereInput[]
    id?: StringFilter<"GoalAction"> | string
    goalId?: StringFilter<"GoalAction"> | string
    title?: StringFilter<"GoalAction"> | string
    description?: StringNullableFilter<"GoalAction"> | string | null
    isCompleted?: BoolFilter<"GoalAction"> | boolean
    targetDate?: DateTimeNullableFilter<"GoalAction"> | Date | string | null
    dimensions?: StringNullableListFilter<"GoalAction">
    attributes?: StringNullableListFilter<"GoalAction">
    impact?: JsonNullableFilter<"GoalAction">
    createdAt?: DateTimeFilter<"GoalAction"> | Date | string
    updatedAt?: DateTimeNullableFilter<"GoalAction"> | Date | string | null
    goal?: XOR<GoalRelationFilter, GoalWhereInput>
    tasks?: TaskListRelationFilter
  }

  export type GoalActionOrderByWithRelationInput = {
    id?: SortOrder
    goalId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    targetDate?: SortOrder
    dimensions?: SortOrder
    attributes?: SortOrder
    impact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    goal?: GoalOrderByWithRelationInput
    tasks?: TaskOrderByRelationAggregateInput
  }

  export type GoalActionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: GoalActionWhereInput | GoalActionWhereInput[]
    OR?: GoalActionWhereInput[]
    NOT?: GoalActionWhereInput | GoalActionWhereInput[]
    goalId?: StringFilter<"GoalAction"> | string
    title?: StringFilter<"GoalAction"> | string
    description?: StringNullableFilter<"GoalAction"> | string | null
    isCompleted?: BoolFilter<"GoalAction"> | boolean
    targetDate?: DateTimeNullableFilter<"GoalAction"> | Date | string | null
    dimensions?: StringNullableListFilter<"GoalAction">
    attributes?: StringNullableListFilter<"GoalAction">
    impact?: JsonNullableFilter<"GoalAction">
    createdAt?: DateTimeFilter<"GoalAction"> | Date | string
    updatedAt?: DateTimeNullableFilter<"GoalAction"> | Date | string | null
    goal?: XOR<GoalRelationFilter, GoalWhereInput>
    tasks?: TaskListRelationFilter
  }, "id">

  export type GoalActionOrderByWithAggregationInput = {
    id?: SortOrder
    goalId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    targetDate?: SortOrder
    dimensions?: SortOrder
    attributes?: SortOrder
    impact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: GoalActionCountOrderByAggregateInput
    _max?: GoalActionMaxOrderByAggregateInput
    _min?: GoalActionMinOrderByAggregateInput
  }

  export type GoalActionScalarWhereWithAggregatesInput = {
    AND?: GoalActionScalarWhereWithAggregatesInput | GoalActionScalarWhereWithAggregatesInput[]
    OR?: GoalActionScalarWhereWithAggregatesInput[]
    NOT?: GoalActionScalarWhereWithAggregatesInput | GoalActionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"GoalAction"> | string
    goalId?: StringWithAggregatesFilter<"GoalAction"> | string
    title?: StringWithAggregatesFilter<"GoalAction"> | string
    description?: StringNullableWithAggregatesFilter<"GoalAction"> | string | null
    isCompleted?: BoolWithAggregatesFilter<"GoalAction"> | boolean
    targetDate?: DateTimeNullableWithAggregatesFilter<"GoalAction"> | Date | string | null
    dimensions?: StringNullableListFilter<"GoalAction">
    attributes?: StringNullableListFilter<"GoalAction">
    impact?: JsonNullableWithAggregatesFilter<"GoalAction">
    createdAt?: DateTimeWithAggregatesFilter<"GoalAction"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"GoalAction"> | Date | string | null
  }

  export type TaskWhereInput = {
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    id?: StringFilter<"Task"> | string
    goalActionId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    isCompleted?: BoolFilter<"Task"> | boolean
    startDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    estimatedHours?: FloatNullableFilter<"Task"> | number | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    goalAction?: XOR<GoalActionRelationFilter, GoalActionWhereInput>
  }

  export type TaskOrderByWithRelationInput = {
    id?: SortOrder
    goalActionId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    estimatedHours?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    goalAction?: GoalActionOrderByWithRelationInput
  }

  export type TaskWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: TaskWhereInput | TaskWhereInput[]
    OR?: TaskWhereInput[]
    NOT?: TaskWhereInput | TaskWhereInput[]
    goalActionId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    isCompleted?: BoolFilter<"Task"> | boolean
    startDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    estimatedHours?: FloatNullableFilter<"Task"> | number | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
    goalAction?: XOR<GoalActionRelationFilter, GoalActionWhereInput>
  }, "id">

  export type TaskOrderByWithAggregationInput = {
    id?: SortOrder
    goalActionId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    estimatedHours?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: TaskCountOrderByAggregateInput
    _avg?: TaskAvgOrderByAggregateInput
    _max?: TaskMaxOrderByAggregateInput
    _min?: TaskMinOrderByAggregateInput
    _sum?: TaskSumOrderByAggregateInput
  }

  export type TaskScalarWhereWithAggregatesInput = {
    AND?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    OR?: TaskScalarWhereWithAggregatesInput[]
    NOT?: TaskScalarWhereWithAggregatesInput | TaskScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"Task"> | string
    goalActionId?: StringWithAggregatesFilter<"Task"> | string
    title?: StringWithAggregatesFilter<"Task"> | string
    description?: StringNullableWithAggregatesFilter<"Task"> | string | null
    isCompleted?: BoolWithAggregatesFilter<"Task"> | boolean
    startDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    endDate?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
    estimatedHours?: FloatNullableWithAggregatesFilter<"Task"> | number | null
    createdAt?: DateTimeWithAggregatesFilter<"Task"> | Date | string
    updatedAt?: DateTimeNullableWithAggregatesFilter<"Task"> | Date | string | null
  }

  export type ChatSessionWhereInput = {
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: StringFilter<"ChatSession"> | string
    context?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    messages?: ChatMessageListRelationFilter
    user?: XOR<UserRelationFilter, UserWhereInput>
  }

  export type ChatSessionOrderByWithRelationInput = {
    id?: SortOrder
    userId?: SortOrder
    context?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    messages?: ChatMessageOrderByRelationAggregateInput
    user?: UserOrderByWithRelationInput
  }

  export type ChatSessionWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatSessionWhereInput | ChatSessionWhereInput[]
    OR?: ChatSessionWhereInput[]
    NOT?: ChatSessionWhereInput | ChatSessionWhereInput[]
    userId?: StringFilter<"ChatSession"> | string
    context?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
    messages?: ChatMessageListRelationFilter
    user?: XOR<UserRelationFilter, UserWhereInput>
  }, "id">

  export type ChatSessionOrderByWithAggregationInput = {
    id?: SortOrder
    userId?: SortOrder
    context?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ChatSessionCountOrderByAggregateInput
    _max?: ChatSessionMaxOrderByAggregateInput
    _min?: ChatSessionMinOrderByAggregateInput
  }

  export type ChatSessionScalarWhereWithAggregatesInput = {
    AND?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    OR?: ChatSessionScalarWhereWithAggregatesInput[]
    NOT?: ChatSessionScalarWhereWithAggregatesInput | ChatSessionScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatSession"> | string
    userId?: StringWithAggregatesFilter<"ChatSession"> | string
    context?: StringWithAggregatesFilter<"ChatSession"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ChatSession"> | Date | string
  }

  export type ChatMessageWhereInput = {
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    session?: XOR<ChatSessionRelationFilter, ChatSessionWhereInput>
  }

  export type ChatMessageOrderByWithRelationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    session?: ChatSessionOrderByWithRelationInput
  }

  export type ChatMessageWhereUniqueInput = Prisma.AtLeast<{
    id?: string
    AND?: ChatMessageWhereInput | ChatMessageWhereInput[]
    OR?: ChatMessageWhereInput[]
    NOT?: ChatMessageWhereInput | ChatMessageWhereInput[]
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
    session?: XOR<ChatSessionRelationFilter, ChatSessionWhereInput>
  }, "id">

  export type ChatMessageOrderByWithAggregationInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
    _count?: ChatMessageCountOrderByAggregateInput
    _max?: ChatMessageMaxOrderByAggregateInput
    _min?: ChatMessageMinOrderByAggregateInput
  }

  export type ChatMessageScalarWhereWithAggregatesInput = {
    AND?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    OR?: ChatMessageScalarWhereWithAggregatesInput[]
    NOT?: ChatMessageScalarWhereWithAggregatesInput | ChatMessageScalarWhereWithAggregatesInput[]
    id?: StringWithAggregatesFilter<"ChatMessage"> | string
    sessionId?: StringWithAggregatesFilter<"ChatMessage"> | string
    role?: StringWithAggregatesFilter<"ChatMessage"> | string
    content?: StringWithAggregatesFilter<"ChatMessage"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ChatMessage"> | Date | string
  }

  export type UserCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventCreateNestedManyWithoutUserInput
    goals?: GoalCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateUncheckedCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventUncheckedCreateNestedManyWithoutUserInput
    goals?: GoalUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUpdateManyWithoutUserNestedInput
    goals?: GoalUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUncheckedUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUncheckedUpdateManyWithoutUserNestedInput
    goals?: GoalUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateManyInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserUpdateManyMutationInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserUncheckedUpdateManyInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionCreateInput = {
    id?: string
    name: string
    label: string
    category: string
    description?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutDimensionInput
    dimensionInputs?: DimensionInputCreateNestedManyWithoutDimensionInput
  }

  export type DimensionUncheckedCreateInput = {
    id?: string
    name: string
    label: string
    category: string
    description?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutDimensionInput
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutDimensionInput
  }

  export type DimensionUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutDimensionNestedInput
    dimensionInputs?: DimensionInputUpdateManyWithoutDimensionNestedInput
  }

  export type DimensionUncheckedUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutDimensionNestedInput
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutDimensionNestedInput
  }

  export type DimensionCreateManyInput = {
    id?: string
    name: string
    label: string
    category: string
    description?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type DimensionUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionUncheckedUpdateManyInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAttributeCreateInput = {
    id?: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAttributesInput
    dimension: DimensionCreateNestedOneWithoutAttributesInput
  }

  export type UserAttributeUncheckedCreateInput = {
    id?: string
    userId: string
    dimensionId: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type UserAttributeUpdateInput = {
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAttributesNestedInput
    dimension?: DimensionUpdateOneRequiredWithoutAttributesNestedInput
  }

  export type UserAttributeUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    dimensionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAttributeCreateManyInput = {
    id?: string
    userId: string
    dimensionId: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type UserAttributeUpdateManyMutationInput = {
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAttributeUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    dimensionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionInputCreateInput = {
    id?: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutDimensionInputsInput
    dimension: DimensionCreateNestedOneWithoutDimensionInputsInput
  }

  export type DimensionInputUncheckedCreateInput = {
    id?: string
    userId: string
    dimensionId: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
  }

  export type DimensionInputUpdateInput = {
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDimensionInputsNestedInput
    dimension?: DimensionUpdateOneRequiredWithoutDimensionInputsNestedInput
  }

  export type DimensionInputUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    dimensionId?: StringFieldUpdateOperationsInput | string
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionInputCreateManyInput = {
    id?: string
    userId: string
    dimensionId: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
  }

  export type DimensionInputUpdateManyMutationInput = {
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionInputUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    dimensionId?: StringFieldUpdateOperationsInput | string
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeStateCreateInput = {
    id?: string
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp?: Date | string
    triggeredBy?: string | null
    insights?: InputJsonValue | null
    scores?: XOR<DimensionScoreListCreateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
    user: UserCreateNestedOneWithoutLifeStatesInput
  }

  export type LifeStateUncheckedCreateInput = {
    id?: string
    userId: string
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp?: Date | string
    triggeredBy?: string | null
    insights?: InputJsonValue | null
    scores?: XOR<DimensionScoreListCreateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateUpdateInput = {
    lifeScore?: FloatFieldUpdateOperationsInput | number
    balanceScore?: FloatFieldUpdateOperationsInput | number
    alignmentScore?: FloatFieldUpdateOperationsInput | number
    energyIndex?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    insights?: InputJsonValue | InputJsonValue | null
    scores?: XOR<DimensionScoreListUpdateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
    user?: UserUpdateOneRequiredWithoutLifeStatesNestedInput
  }

  export type LifeStateUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    lifeScore?: FloatFieldUpdateOperationsInput | number
    balanceScore?: FloatFieldUpdateOperationsInput | number
    alignmentScore?: FloatFieldUpdateOperationsInput | number
    energyIndex?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    insights?: InputJsonValue | InputJsonValue | null
    scores?: XOR<DimensionScoreListUpdateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateCreateManyInput = {
    id?: string
    userId: string
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp?: Date | string
    triggeredBy?: string | null
    insights?: InputJsonValue | null
    scores?: XOR<DimensionScoreListCreateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateUpdateManyMutationInput = {
    lifeScore?: FloatFieldUpdateOperationsInput | number
    balanceScore?: FloatFieldUpdateOperationsInput | number
    alignmentScore?: FloatFieldUpdateOperationsInput | number
    energyIndex?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    insights?: InputJsonValue | InputJsonValue | null
    scores?: XOR<DimensionScoreListUpdateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    lifeScore?: FloatFieldUpdateOperationsInput | number
    balanceScore?: FloatFieldUpdateOperationsInput | number
    alignmentScore?: FloatFieldUpdateOperationsInput | number
    energyIndex?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    insights?: InputJsonValue | InputJsonValue | null
    scores?: XOR<DimensionScoreListUpdateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeEventCreateInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    impact?: InputJsonValue | null
    metadata?: InputJsonValue | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutLifeEventsInput
  }

  export type LifeEventUncheckedCreateInput = {
    id?: string
    userId: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    impact?: InputJsonValue | null
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type LifeEventUpdateInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: InputJsonValue | InputJsonValue | null
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutLifeEventsNestedInput
  }

  export type LifeEventUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: InputJsonValue | InputJsonValue | null
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventCreateManyInput = {
    id?: string
    userId: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    impact?: InputJsonValue | null
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type LifeEventUpdateManyMutationInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: InputJsonValue | InputJsonValue | null
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: InputJsonValue | InputJsonValue | null
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalCreateInput = {
    id?: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    user: UserCreateNestedOneWithoutGoalsInput
    actions?: GoalActionCreateNestedManyWithoutGoalInput
  }

  export type GoalUncheckedCreateInput = {
    id?: string
    userId: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    actions?: GoalActionUncheckedCreateNestedManyWithoutGoalInput
  }

  export type GoalUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutGoalsNestedInput
    actions?: GoalActionUpdateManyWithoutGoalNestedInput
  }

  export type GoalUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actions?: GoalActionUncheckedUpdateManyWithoutGoalNestedInput
  }

  export type GoalCreateManyInput = {
    id?: string
    userId: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type GoalUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GoalUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GoalActionCreateInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    goal: GoalCreateNestedOneWithoutActionsInput
    tasks?: TaskCreateNestedManyWithoutGoalActionInput
  }

  export type GoalActionUncheckedCreateInput = {
    id?: string
    goalId: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    tasks?: TaskUncheckedCreateNestedManyWithoutGoalActionInput
  }

  export type GoalActionUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goal?: GoalUpdateOneRequiredWithoutActionsNestedInput
    tasks?: TaskUpdateManyWithoutGoalActionNestedInput
  }

  export type GoalActionUncheckedUpdateInput = {
    goalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tasks?: TaskUncheckedUpdateManyWithoutGoalActionNestedInput
  }

  export type GoalActionCreateManyInput = {
    id?: string
    goalId: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type GoalActionUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type GoalActionUncheckedUpdateManyInput = {
    goalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskCreateInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    startDate?: Date | string | null
    endDate?: Date | string | null
    estimatedHours?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    goalAction: GoalActionCreateNestedOneWithoutTasksInput
  }

  export type TaskUncheckedCreateInput = {
    id?: string
    goalActionId: string
    title: string
    description?: string | null
    isCompleted?: boolean
    startDate?: Date | string | null
    endDate?: Date | string | null
    estimatedHours?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type TaskUpdateInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedHours?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goalAction?: GoalActionUpdateOneRequiredWithoutTasksNestedInput
  }

  export type TaskUncheckedUpdateInput = {
    goalActionId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedHours?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskCreateManyInput = {
    id?: string
    goalActionId: string
    title: string
    description?: string | null
    isCompleted?: boolean
    startDate?: Date | string | null
    endDate?: Date | string | null
    estimatedHours?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type TaskUpdateManyMutationInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedHours?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUncheckedUpdateManyInput = {
    goalActionId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedHours?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatSessionCreateInput = {
    id?: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
    user: UserCreateNestedOneWithoutChatSessionsInput
  }

  export type ChatSessionUncheckedCreateInput = {
    id?: string
    userId: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUpdateInput = {
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
  }

  export type ChatSessionUncheckedUpdateInput = {
    userId?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionCreateManyInput = {
    id?: string
    userId: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionUpdateManyMutationInput = {
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatSessionUncheckedUpdateManyInput = {
    userId?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
    session: ChatSessionCreateNestedOneWithoutMessagesInput
  }

  export type ChatMessageUncheckedCreateInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUpdateInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    session?: ChatSessionUpdateOneRequiredWithoutMessagesNestedInput
  }

  export type ChatMessageUncheckedUpdateInput = {
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageCreateManyInput = {
    id?: string
    sessionId: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUpdateManyMutationInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyInput = {
    sessionId?: StringFieldUpdateOperationsInput | string
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type UserAttributeListRelationFilter = {
    every?: UserAttributeWhereInput
    some?: UserAttributeWhereInput
    none?: UserAttributeWhereInput
  }

  export type DimensionInputListRelationFilter = {
    every?: DimensionInputWhereInput
    some?: DimensionInputWhereInput
    none?: DimensionInputWhereInput
  }

  export type LifeStateListRelationFilter = {
    every?: LifeStateWhereInput
    some?: LifeStateWhereInput
    none?: LifeStateWhereInput
  }

  export type LifeEventListRelationFilter = {
    every?: LifeEventWhereInput
    some?: LifeEventWhereInput
    none?: LifeEventWhereInput
  }

  export type GoalListRelationFilter = {
    every?: GoalWhereInput
    some?: GoalWhereInput
    none?: GoalWhereInput
  }

  export type ChatSessionListRelationFilter = {
    every?: ChatSessionWhereInput
    some?: ChatSessionWhereInput
    none?: ChatSessionWhereInput
  }

  export type UserAttributeOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type DimensionInputOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LifeStateOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type LifeEventOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GoalOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type UserCountOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMaxOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type UserMinOrderByAggregateInput = {
    id?: SortOrder
    email?: SortOrder
    name?: SortOrder
    avatarUrl?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    mode?: QueryMode
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type DimensionCountOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    label?: SortOrder
    category?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DimensionAvgOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type DimensionMaxOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    label?: SortOrder
    category?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DimensionMinOrderByAggregateInput = {
    id?: SortOrder
    name?: SortOrder
    label?: SortOrder
    category?: SortOrder
    description?: SortOrder
    sortOrder?: SortOrder
    isActive?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type DimensionSumOrderByAggregateInput = {
    sortOrder?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type JsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }

  export type UserRelationFilter = {
    is?: UserWhereInput
    isNot?: UserWhereInput
  }

  export type DimensionRelationFilter = {
    is?: DimensionWhereInput
    isNot?: DimensionWhereInput
  }

  export type UserAttributeCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAttributeMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAttributeMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    name?: SortOrder
    category?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonNullableWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonNullableWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonNullableWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedJsonNullableFilter<$PrismaModel>
    _max?: NestedJsonNullableFilter<$PrismaModel>
    isSet?: boolean
  }
  export type JsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
  }

  export type DimensionInputCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    inputType?: SortOrder
    subType?: SortOrder
    valueJson?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type DimensionInputMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    inputType?: SortOrder
    subType?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }

  export type DimensionInputMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    dimensionId?: SortOrder
    inputType?: SortOrder
    subType?: SortOrder
    source?: SortOrder
    createdAt?: SortOrder
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type DimensionScoreCompositeListFilter = {
    equals?: DimensionScoreObjectEqualityInput[]
    every?: DimensionScoreWhereInput
    some?: DimensionScoreWhereInput
    none?: DimensionScoreWhereInput
    isEmpty?: boolean
    isSet?: boolean
  }

  export type DimensionScoreObjectEqualityInput = {
    dimensionId: string
    score: number
    trend: string
    confidence?: number | null
  }

  export type DimensionScoreOrderByCompositeAggregateInput = {
    _count?: SortOrder
  }

  export type LifeStateCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    lifeScore?: SortOrder
    balanceScore?: SortOrder
    alignmentScore?: SortOrder
    energyIndex?: SortOrder
    timestamp?: SortOrder
    triggeredBy?: SortOrder
    insights?: SortOrder
  }

  export type LifeStateAvgOrderByAggregateInput = {
    lifeScore?: SortOrder
    balanceScore?: SortOrder
    alignmentScore?: SortOrder
    energyIndex?: SortOrder
  }

  export type LifeStateMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    lifeScore?: SortOrder
    balanceScore?: SortOrder
    alignmentScore?: SortOrder
    energyIndex?: SortOrder
    timestamp?: SortOrder
    triggeredBy?: SortOrder
  }

  export type LifeStateMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    lifeScore?: SortOrder
    balanceScore?: SortOrder
    alignmentScore?: SortOrder
    energyIndex?: SortOrder
    timestamp?: SortOrder
    triggeredBy?: SortOrder
  }

  export type LifeStateSumOrderByAggregateInput = {
    lifeScore?: SortOrder
    balanceScore?: SortOrder
    alignmentScore?: SortOrder
    energyIndex?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type LifeEventCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    impact?: SortOrder
    metadata?: SortOrder
    createdAt?: SortOrder
  }

  export type LifeEventMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
  }

  export type LifeEventMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    type?: SortOrder
    title?: SortOrder
    description?: SortOrder
    date?: SortOrder
    createdAt?: SortOrder
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type GoalActionListRelationFilter = {
    every?: GoalActionWhereInput
    some?: GoalActionWhereInput
    none?: GoalActionWhereInput
  }

  export type GoalActionOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GoalCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    dimensionId?: SortOrder
    progress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalAvgOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type GoalMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    dimensionId?: SortOrder
    progress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    dimensionId?: SortOrder
    progress?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalSumOrderByAggregateInput = {
    progress?: SortOrder
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    has?: string | StringFieldRefInput<$PrismaModel> | null
    hasEvery?: string[] | ListStringFieldRefInput<$PrismaModel>
    hasSome?: string[] | ListStringFieldRefInput<$PrismaModel>
    isEmpty?: boolean
  }

  export type GoalRelationFilter = {
    is?: GoalWhereInput
    isNot?: GoalWhereInput
  }

  export type TaskListRelationFilter = {
    every?: TaskWhereInput
    some?: TaskWhereInput
    none?: TaskWhereInput
  }

  export type TaskOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type GoalActionCountOrderByAggregateInput = {
    id?: SortOrder
    goalId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    targetDate?: SortOrder
    dimensions?: SortOrder
    attributes?: SortOrder
    impact?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalActionMaxOrderByAggregateInput = {
    id?: SortOrder
    goalId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    targetDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type GoalActionMinOrderByAggregateInput = {
    id?: SortOrder
    goalId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    targetDate?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type GoalActionRelationFilter = {
    is?: GoalActionWhereInput
    isNot?: GoalActionWhereInput
  }

  export type TaskCountOrderByAggregateInput = {
    id?: SortOrder
    goalActionId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    estimatedHours?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskAvgOrderByAggregateInput = {
    estimatedHours?: SortOrder
  }

  export type TaskMaxOrderByAggregateInput = {
    id?: SortOrder
    goalActionId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    estimatedHours?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskMinOrderByAggregateInput = {
    id?: SortOrder
    goalActionId?: SortOrder
    title?: SortOrder
    description?: SortOrder
    isCompleted?: SortOrder
    startDate?: SortOrder
    endDate?: SortOrder
    estimatedHours?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type TaskSumOrderByAggregateInput = {
    estimatedHours?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type ChatMessageListRelationFilter = {
    every?: ChatMessageWhereInput
    some?: ChatMessageWhereInput
    none?: ChatMessageWhereInput
  }

  export type ChatMessageOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ChatSessionCountOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    context?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionMaxOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    context?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionMinOrderByAggregateInput = {
    id?: SortOrder
    userId?: SortOrder
    context?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ChatSessionRelationFilter = {
    is?: ChatSessionWhereInput
    isNot?: ChatSessionWhereInput
  }

  export type ChatMessageCountOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMaxOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type ChatMessageMinOrderByAggregateInput = {
    id?: SortOrder
    sessionId?: SortOrder
    role?: SortOrder
    content?: SortOrder
    createdAt?: SortOrder
  }

  export type UserAttributeCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAttributeCreateWithoutUserInput, UserAttributeUncheckedCreateWithoutUserInput> | UserAttributeCreateWithoutUserInput[] | UserAttributeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutUserInput | UserAttributeCreateOrConnectWithoutUserInput[]
    createMany?: UserAttributeCreateManyUserInputEnvelope
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
  }

  export type DimensionInputCreateNestedManyWithoutUserInput = {
    create?: XOR<DimensionInputCreateWithoutUserInput, DimensionInputUncheckedCreateWithoutUserInput> | DimensionInputCreateWithoutUserInput[] | DimensionInputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutUserInput | DimensionInputCreateOrConnectWithoutUserInput[]
    createMany?: DimensionInputCreateManyUserInputEnvelope
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
  }

  export type LifeStateCreateNestedManyWithoutUserInput = {
    create?: XOR<LifeStateCreateWithoutUserInput, LifeStateUncheckedCreateWithoutUserInput> | LifeStateCreateWithoutUserInput[] | LifeStateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeStateCreateOrConnectWithoutUserInput | LifeStateCreateOrConnectWithoutUserInput[]
    createMany?: LifeStateCreateManyUserInputEnvelope
    connect?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
  }

  export type LifeEventCreateNestedManyWithoutUserInput = {
    create?: XOR<LifeEventCreateWithoutUserInput, LifeEventUncheckedCreateWithoutUserInput> | LifeEventCreateWithoutUserInput[] | LifeEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutUserInput | LifeEventCreateOrConnectWithoutUserInput[]
    createMany?: LifeEventCreateManyUserInputEnvelope
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
  }

  export type GoalCreateNestedManyWithoutUserInput = {
    create?: XOR<GoalCreateWithoutUserInput, GoalUncheckedCreateWithoutUserInput> | GoalCreateWithoutUserInput[] | GoalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GoalCreateOrConnectWithoutUserInput | GoalCreateOrConnectWithoutUserInput[]
    createMany?: GoalCreateManyUserInputEnvelope
    connect?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
  }

  export type ChatSessionCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type UserAttributeUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<UserAttributeCreateWithoutUserInput, UserAttributeUncheckedCreateWithoutUserInput> | UserAttributeCreateWithoutUserInput[] | UserAttributeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutUserInput | UserAttributeCreateOrConnectWithoutUserInput[]
    createMany?: UserAttributeCreateManyUserInputEnvelope
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
  }

  export type DimensionInputUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<DimensionInputCreateWithoutUserInput, DimensionInputUncheckedCreateWithoutUserInput> | DimensionInputCreateWithoutUserInput[] | DimensionInputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutUserInput | DimensionInputCreateOrConnectWithoutUserInput[]
    createMany?: DimensionInputCreateManyUserInputEnvelope
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
  }

  export type LifeStateUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LifeStateCreateWithoutUserInput, LifeStateUncheckedCreateWithoutUserInput> | LifeStateCreateWithoutUserInput[] | LifeStateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeStateCreateOrConnectWithoutUserInput | LifeStateCreateOrConnectWithoutUserInput[]
    createMany?: LifeStateCreateManyUserInputEnvelope
    connect?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
  }

  export type LifeEventUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<LifeEventCreateWithoutUserInput, LifeEventUncheckedCreateWithoutUserInput> | LifeEventCreateWithoutUserInput[] | LifeEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutUserInput | LifeEventCreateOrConnectWithoutUserInput[]
    createMany?: LifeEventCreateManyUserInputEnvelope
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
  }

  export type GoalUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<GoalCreateWithoutUserInput, GoalUncheckedCreateWithoutUserInput> | GoalCreateWithoutUserInput[] | GoalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GoalCreateOrConnectWithoutUserInput | GoalCreateOrConnectWithoutUserInput[]
    createMany?: GoalCreateManyUserInputEnvelope
    connect?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
  }

  export type ChatSessionUncheckedCreateNestedManyWithoutUserInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
    unset?: boolean
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type UserAttributeUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAttributeCreateWithoutUserInput, UserAttributeUncheckedCreateWithoutUserInput> | UserAttributeCreateWithoutUserInput[] | UserAttributeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutUserInput | UserAttributeCreateOrConnectWithoutUserInput[]
    upsert?: UserAttributeUpsertWithWhereUniqueWithoutUserInput | UserAttributeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAttributeCreateManyUserInputEnvelope
    set?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    disconnect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    delete?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    update?: UserAttributeUpdateWithWhereUniqueWithoutUserInput | UserAttributeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAttributeUpdateManyWithWhereWithoutUserInput | UserAttributeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAttributeScalarWhereInput | UserAttributeScalarWhereInput[]
  }

  export type DimensionInputUpdateManyWithoutUserNestedInput = {
    create?: XOR<DimensionInputCreateWithoutUserInput, DimensionInputUncheckedCreateWithoutUserInput> | DimensionInputCreateWithoutUserInput[] | DimensionInputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutUserInput | DimensionInputCreateOrConnectWithoutUserInput[]
    upsert?: DimensionInputUpsertWithWhereUniqueWithoutUserInput | DimensionInputUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DimensionInputCreateManyUserInputEnvelope
    set?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    disconnect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    delete?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    update?: DimensionInputUpdateWithWhereUniqueWithoutUserInput | DimensionInputUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DimensionInputUpdateManyWithWhereWithoutUserInput | DimensionInputUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DimensionInputScalarWhereInput | DimensionInputScalarWhereInput[]
  }

  export type LifeStateUpdateManyWithoutUserNestedInput = {
    create?: XOR<LifeStateCreateWithoutUserInput, LifeStateUncheckedCreateWithoutUserInput> | LifeStateCreateWithoutUserInput[] | LifeStateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeStateCreateOrConnectWithoutUserInput | LifeStateCreateOrConnectWithoutUserInput[]
    upsert?: LifeStateUpsertWithWhereUniqueWithoutUserInput | LifeStateUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LifeStateCreateManyUserInputEnvelope
    set?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    disconnect?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    delete?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    connect?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    update?: LifeStateUpdateWithWhereUniqueWithoutUserInput | LifeStateUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LifeStateUpdateManyWithWhereWithoutUserInput | LifeStateUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LifeStateScalarWhereInput | LifeStateScalarWhereInput[]
  }

  export type LifeEventUpdateManyWithoutUserNestedInput = {
    create?: XOR<LifeEventCreateWithoutUserInput, LifeEventUncheckedCreateWithoutUserInput> | LifeEventCreateWithoutUserInput[] | LifeEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutUserInput | LifeEventCreateOrConnectWithoutUserInput[]
    upsert?: LifeEventUpsertWithWhereUniqueWithoutUserInput | LifeEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LifeEventCreateManyUserInputEnvelope
    set?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    disconnect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    delete?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    update?: LifeEventUpdateWithWhereUniqueWithoutUserInput | LifeEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LifeEventUpdateManyWithWhereWithoutUserInput | LifeEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
  }

  export type GoalUpdateManyWithoutUserNestedInput = {
    create?: XOR<GoalCreateWithoutUserInput, GoalUncheckedCreateWithoutUserInput> | GoalCreateWithoutUserInput[] | GoalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GoalCreateOrConnectWithoutUserInput | GoalCreateOrConnectWithoutUserInput[]
    upsert?: GoalUpsertWithWhereUniqueWithoutUserInput | GoalUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GoalCreateManyUserInputEnvelope
    set?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    disconnect?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    delete?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    connect?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    update?: GoalUpdateWithWhereUniqueWithoutUserInput | GoalUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GoalUpdateManyWithWhereWithoutUserInput | GoalUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GoalScalarWhereInput | GoalScalarWhereInput[]
  }

  export type ChatSessionUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type UserAttributeUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<UserAttributeCreateWithoutUserInput, UserAttributeUncheckedCreateWithoutUserInput> | UserAttributeCreateWithoutUserInput[] | UserAttributeUncheckedCreateWithoutUserInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutUserInput | UserAttributeCreateOrConnectWithoutUserInput[]
    upsert?: UserAttributeUpsertWithWhereUniqueWithoutUserInput | UserAttributeUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: UserAttributeCreateManyUserInputEnvelope
    set?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    disconnect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    delete?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    update?: UserAttributeUpdateWithWhereUniqueWithoutUserInput | UserAttributeUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: UserAttributeUpdateManyWithWhereWithoutUserInput | UserAttributeUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: UserAttributeScalarWhereInput | UserAttributeScalarWhereInput[]
  }

  export type DimensionInputUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<DimensionInputCreateWithoutUserInput, DimensionInputUncheckedCreateWithoutUserInput> | DimensionInputCreateWithoutUserInput[] | DimensionInputUncheckedCreateWithoutUserInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutUserInput | DimensionInputCreateOrConnectWithoutUserInput[]
    upsert?: DimensionInputUpsertWithWhereUniqueWithoutUserInput | DimensionInputUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: DimensionInputCreateManyUserInputEnvelope
    set?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    disconnect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    delete?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    update?: DimensionInputUpdateWithWhereUniqueWithoutUserInput | DimensionInputUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: DimensionInputUpdateManyWithWhereWithoutUserInput | DimensionInputUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: DimensionInputScalarWhereInput | DimensionInputScalarWhereInput[]
  }

  export type LifeStateUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LifeStateCreateWithoutUserInput, LifeStateUncheckedCreateWithoutUserInput> | LifeStateCreateWithoutUserInput[] | LifeStateUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeStateCreateOrConnectWithoutUserInput | LifeStateCreateOrConnectWithoutUserInput[]
    upsert?: LifeStateUpsertWithWhereUniqueWithoutUserInput | LifeStateUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LifeStateCreateManyUserInputEnvelope
    set?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    disconnect?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    delete?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    connect?: LifeStateWhereUniqueInput | LifeStateWhereUniqueInput[]
    update?: LifeStateUpdateWithWhereUniqueWithoutUserInput | LifeStateUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LifeStateUpdateManyWithWhereWithoutUserInput | LifeStateUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LifeStateScalarWhereInput | LifeStateScalarWhereInput[]
  }

  export type LifeEventUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<LifeEventCreateWithoutUserInput, LifeEventUncheckedCreateWithoutUserInput> | LifeEventCreateWithoutUserInput[] | LifeEventUncheckedCreateWithoutUserInput[]
    connectOrCreate?: LifeEventCreateOrConnectWithoutUserInput | LifeEventCreateOrConnectWithoutUserInput[]
    upsert?: LifeEventUpsertWithWhereUniqueWithoutUserInput | LifeEventUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: LifeEventCreateManyUserInputEnvelope
    set?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    disconnect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    delete?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    connect?: LifeEventWhereUniqueInput | LifeEventWhereUniqueInput[]
    update?: LifeEventUpdateWithWhereUniqueWithoutUserInput | LifeEventUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: LifeEventUpdateManyWithWhereWithoutUserInput | LifeEventUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
  }

  export type GoalUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<GoalCreateWithoutUserInput, GoalUncheckedCreateWithoutUserInput> | GoalCreateWithoutUserInput[] | GoalUncheckedCreateWithoutUserInput[]
    connectOrCreate?: GoalCreateOrConnectWithoutUserInput | GoalCreateOrConnectWithoutUserInput[]
    upsert?: GoalUpsertWithWhereUniqueWithoutUserInput | GoalUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: GoalCreateManyUserInputEnvelope
    set?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    disconnect?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    delete?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    connect?: GoalWhereUniqueInput | GoalWhereUniqueInput[]
    update?: GoalUpdateWithWhereUniqueWithoutUserInput | GoalUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: GoalUpdateManyWithWhereWithoutUserInput | GoalUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: GoalScalarWhereInput | GoalScalarWhereInput[]
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserNestedInput = {
    create?: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput> | ChatSessionCreateWithoutUserInput[] | ChatSessionUncheckedCreateWithoutUserInput[]
    connectOrCreate?: ChatSessionCreateOrConnectWithoutUserInput | ChatSessionCreateOrConnectWithoutUserInput[]
    upsert?: ChatSessionUpsertWithWhereUniqueWithoutUserInput | ChatSessionUpsertWithWhereUniqueWithoutUserInput[]
    createMany?: ChatSessionCreateManyUserInputEnvelope
    set?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    disconnect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    delete?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    connect?: ChatSessionWhereUniqueInput | ChatSessionWhereUniqueInput[]
    update?: ChatSessionUpdateWithWhereUniqueWithoutUserInput | ChatSessionUpdateWithWhereUniqueWithoutUserInput[]
    updateMany?: ChatSessionUpdateManyWithWhereWithoutUserInput | ChatSessionUpdateManyWithWhereWithoutUserInput[]
    deleteMany?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
  }

  export type UserAttributeCreateNestedManyWithoutDimensionInput = {
    create?: XOR<UserAttributeCreateWithoutDimensionInput, UserAttributeUncheckedCreateWithoutDimensionInput> | UserAttributeCreateWithoutDimensionInput[] | UserAttributeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutDimensionInput | UserAttributeCreateOrConnectWithoutDimensionInput[]
    createMany?: UserAttributeCreateManyDimensionInputEnvelope
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
  }

  export type DimensionInputCreateNestedManyWithoutDimensionInput = {
    create?: XOR<DimensionInputCreateWithoutDimensionInput, DimensionInputUncheckedCreateWithoutDimensionInput> | DimensionInputCreateWithoutDimensionInput[] | DimensionInputUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutDimensionInput | DimensionInputCreateOrConnectWithoutDimensionInput[]
    createMany?: DimensionInputCreateManyDimensionInputEnvelope
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
  }

  export type UserAttributeUncheckedCreateNestedManyWithoutDimensionInput = {
    create?: XOR<UserAttributeCreateWithoutDimensionInput, UserAttributeUncheckedCreateWithoutDimensionInput> | UserAttributeCreateWithoutDimensionInput[] | UserAttributeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutDimensionInput | UserAttributeCreateOrConnectWithoutDimensionInput[]
    createMany?: UserAttributeCreateManyDimensionInputEnvelope
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
  }

  export type DimensionInputUncheckedCreateNestedManyWithoutDimensionInput = {
    create?: XOR<DimensionInputCreateWithoutDimensionInput, DimensionInputUncheckedCreateWithoutDimensionInput> | DimensionInputCreateWithoutDimensionInput[] | DimensionInputUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutDimensionInput | DimensionInputCreateOrConnectWithoutDimensionInput[]
    createMany?: DimensionInputCreateManyDimensionInputEnvelope
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type UserAttributeUpdateManyWithoutDimensionNestedInput = {
    create?: XOR<UserAttributeCreateWithoutDimensionInput, UserAttributeUncheckedCreateWithoutDimensionInput> | UserAttributeCreateWithoutDimensionInput[] | UserAttributeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutDimensionInput | UserAttributeCreateOrConnectWithoutDimensionInput[]
    upsert?: UserAttributeUpsertWithWhereUniqueWithoutDimensionInput | UserAttributeUpsertWithWhereUniqueWithoutDimensionInput[]
    createMany?: UserAttributeCreateManyDimensionInputEnvelope
    set?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    disconnect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    delete?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    update?: UserAttributeUpdateWithWhereUniqueWithoutDimensionInput | UserAttributeUpdateWithWhereUniqueWithoutDimensionInput[]
    updateMany?: UserAttributeUpdateManyWithWhereWithoutDimensionInput | UserAttributeUpdateManyWithWhereWithoutDimensionInput[]
    deleteMany?: UserAttributeScalarWhereInput | UserAttributeScalarWhereInput[]
  }

  export type DimensionInputUpdateManyWithoutDimensionNestedInput = {
    create?: XOR<DimensionInputCreateWithoutDimensionInput, DimensionInputUncheckedCreateWithoutDimensionInput> | DimensionInputCreateWithoutDimensionInput[] | DimensionInputUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutDimensionInput | DimensionInputCreateOrConnectWithoutDimensionInput[]
    upsert?: DimensionInputUpsertWithWhereUniqueWithoutDimensionInput | DimensionInputUpsertWithWhereUniqueWithoutDimensionInput[]
    createMany?: DimensionInputCreateManyDimensionInputEnvelope
    set?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    disconnect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    delete?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    update?: DimensionInputUpdateWithWhereUniqueWithoutDimensionInput | DimensionInputUpdateWithWhereUniqueWithoutDimensionInput[]
    updateMany?: DimensionInputUpdateManyWithWhereWithoutDimensionInput | DimensionInputUpdateManyWithWhereWithoutDimensionInput[]
    deleteMany?: DimensionInputScalarWhereInput | DimensionInputScalarWhereInput[]
  }

  export type UserAttributeUncheckedUpdateManyWithoutDimensionNestedInput = {
    create?: XOR<UserAttributeCreateWithoutDimensionInput, UserAttributeUncheckedCreateWithoutDimensionInput> | UserAttributeCreateWithoutDimensionInput[] | UserAttributeUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: UserAttributeCreateOrConnectWithoutDimensionInput | UserAttributeCreateOrConnectWithoutDimensionInput[]
    upsert?: UserAttributeUpsertWithWhereUniqueWithoutDimensionInput | UserAttributeUpsertWithWhereUniqueWithoutDimensionInput[]
    createMany?: UserAttributeCreateManyDimensionInputEnvelope
    set?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    disconnect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    delete?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    connect?: UserAttributeWhereUniqueInput | UserAttributeWhereUniqueInput[]
    update?: UserAttributeUpdateWithWhereUniqueWithoutDimensionInput | UserAttributeUpdateWithWhereUniqueWithoutDimensionInput[]
    updateMany?: UserAttributeUpdateManyWithWhereWithoutDimensionInput | UserAttributeUpdateManyWithWhereWithoutDimensionInput[]
    deleteMany?: UserAttributeScalarWhereInput | UserAttributeScalarWhereInput[]
  }

  export type DimensionInputUncheckedUpdateManyWithoutDimensionNestedInput = {
    create?: XOR<DimensionInputCreateWithoutDimensionInput, DimensionInputUncheckedCreateWithoutDimensionInput> | DimensionInputCreateWithoutDimensionInput[] | DimensionInputUncheckedCreateWithoutDimensionInput[]
    connectOrCreate?: DimensionInputCreateOrConnectWithoutDimensionInput | DimensionInputCreateOrConnectWithoutDimensionInput[]
    upsert?: DimensionInputUpsertWithWhereUniqueWithoutDimensionInput | DimensionInputUpsertWithWhereUniqueWithoutDimensionInput[]
    createMany?: DimensionInputCreateManyDimensionInputEnvelope
    set?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    disconnect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    delete?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    connect?: DimensionInputWhereUniqueInput | DimensionInputWhereUniqueInput[]
    update?: DimensionInputUpdateWithWhereUniqueWithoutDimensionInput | DimensionInputUpdateWithWhereUniqueWithoutDimensionInput[]
    updateMany?: DimensionInputUpdateManyWithWhereWithoutDimensionInput | DimensionInputUpdateManyWithWhereWithoutDimensionInput[]
    deleteMany?: DimensionInputScalarWhereInput | DimensionInputScalarWhereInput[]
  }

  export type UserCreateNestedOneWithoutAttributesInput = {
    create?: XOR<UserCreateWithoutAttributesInput, UserUncheckedCreateWithoutAttributesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAttributesInput
    connect?: UserWhereUniqueInput
  }

  export type DimensionCreateNestedOneWithoutAttributesInput = {
    create?: XOR<DimensionCreateWithoutAttributesInput, DimensionUncheckedCreateWithoutAttributesInput>
    connectOrCreate?: DimensionCreateOrConnectWithoutAttributesInput
    connect?: DimensionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutAttributesNestedInput = {
    create?: XOR<UserCreateWithoutAttributesInput, UserUncheckedCreateWithoutAttributesInput>
    connectOrCreate?: UserCreateOrConnectWithoutAttributesInput
    upsert?: UserUpsertWithoutAttributesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutAttributesInput, UserUpdateWithoutAttributesInput>, UserUncheckedUpdateWithoutAttributesInput>
  }

  export type DimensionUpdateOneRequiredWithoutAttributesNestedInput = {
    create?: XOR<DimensionCreateWithoutAttributesInput, DimensionUncheckedCreateWithoutAttributesInput>
    connectOrCreate?: DimensionCreateOrConnectWithoutAttributesInput
    upsert?: DimensionUpsertWithoutAttributesInput
    connect?: DimensionWhereUniqueInput
    update?: XOR<XOR<DimensionUpdateToOneWithWhereWithoutAttributesInput, DimensionUpdateWithoutAttributesInput>, DimensionUncheckedUpdateWithoutAttributesInput>
  }

  export type UserCreateNestedOneWithoutDimensionInputsInput = {
    create?: XOR<UserCreateWithoutDimensionInputsInput, UserUncheckedCreateWithoutDimensionInputsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDimensionInputsInput
    connect?: UserWhereUniqueInput
  }

  export type DimensionCreateNestedOneWithoutDimensionInputsInput = {
    create?: XOR<DimensionCreateWithoutDimensionInputsInput, DimensionUncheckedCreateWithoutDimensionInputsInput>
    connectOrCreate?: DimensionCreateOrConnectWithoutDimensionInputsInput
    connect?: DimensionWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutDimensionInputsNestedInput = {
    create?: XOR<UserCreateWithoutDimensionInputsInput, UserUncheckedCreateWithoutDimensionInputsInput>
    connectOrCreate?: UserCreateOrConnectWithoutDimensionInputsInput
    upsert?: UserUpsertWithoutDimensionInputsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutDimensionInputsInput, UserUpdateWithoutDimensionInputsInput>, UserUncheckedUpdateWithoutDimensionInputsInput>
  }

  export type DimensionUpdateOneRequiredWithoutDimensionInputsNestedInput = {
    create?: XOR<DimensionCreateWithoutDimensionInputsInput, DimensionUncheckedCreateWithoutDimensionInputsInput>
    connectOrCreate?: DimensionCreateOrConnectWithoutDimensionInputsInput
    upsert?: DimensionUpsertWithoutDimensionInputsInput
    connect?: DimensionWhereUniqueInput
    update?: XOR<XOR<DimensionUpdateToOneWithWhereWithoutDimensionInputsInput, DimensionUpdateWithoutDimensionInputsInput>, DimensionUncheckedUpdateWithoutDimensionInputsInput>
  }

  export type DimensionScoreListCreateEnvelopeInput = {
    set?: DimensionScoreCreateInput | DimensionScoreCreateInput[]
  }

  export type DimensionScoreCreateInput = {
    dimensionId: string
    score: number
    trend?: string
    confidence?: number | null
  }

  export type UserCreateNestedOneWithoutLifeStatesInput = {
    create?: XOR<UserCreateWithoutLifeStatesInput, UserUncheckedCreateWithoutLifeStatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLifeStatesInput
    connect?: UserWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type DimensionScoreListUpdateEnvelopeInput = {
    set?: DimensionScoreCreateInput | DimensionScoreCreateInput[]
    push?: DimensionScoreCreateInput | DimensionScoreCreateInput[]
    updateMany?: DimensionScoreUpdateManyInput
    deleteMany?: DimensionScoreDeleteManyInput
  }

  export type UserUpdateOneRequiredWithoutLifeStatesNestedInput = {
    create?: XOR<UserCreateWithoutLifeStatesInput, UserUncheckedCreateWithoutLifeStatesInput>
    connectOrCreate?: UserCreateOrConnectWithoutLifeStatesInput
    upsert?: UserUpsertWithoutLifeStatesInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLifeStatesInput, UserUpdateWithoutLifeStatesInput>, UserUncheckedUpdateWithoutLifeStatesInput>
  }

  export type UserCreateNestedOneWithoutLifeEventsInput = {
    create?: XOR<UserCreateWithoutLifeEventsInput, UserUncheckedCreateWithoutLifeEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLifeEventsInput
    connect?: UserWhereUniqueInput
  }

  export type UserUpdateOneRequiredWithoutLifeEventsNestedInput = {
    create?: XOR<UserCreateWithoutLifeEventsInput, UserUncheckedCreateWithoutLifeEventsInput>
    connectOrCreate?: UserCreateOrConnectWithoutLifeEventsInput
    upsert?: UserUpsertWithoutLifeEventsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutLifeEventsInput, UserUpdateWithoutLifeEventsInput>, UserUncheckedUpdateWithoutLifeEventsInput>
  }

  export type UserCreateNestedOneWithoutGoalsInput = {
    create?: XOR<UserCreateWithoutGoalsInput, UserUncheckedCreateWithoutGoalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGoalsInput
    connect?: UserWhereUniqueInput
  }

  export type GoalActionCreateNestedManyWithoutGoalInput = {
    create?: XOR<GoalActionCreateWithoutGoalInput, GoalActionUncheckedCreateWithoutGoalInput> | GoalActionCreateWithoutGoalInput[] | GoalActionUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalActionCreateOrConnectWithoutGoalInput | GoalActionCreateOrConnectWithoutGoalInput[]
    createMany?: GoalActionCreateManyGoalInputEnvelope
    connect?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
  }

  export type GoalActionUncheckedCreateNestedManyWithoutGoalInput = {
    create?: XOR<GoalActionCreateWithoutGoalInput, GoalActionUncheckedCreateWithoutGoalInput> | GoalActionCreateWithoutGoalInput[] | GoalActionUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalActionCreateOrConnectWithoutGoalInput | GoalActionCreateOrConnectWithoutGoalInput[]
    createMany?: GoalActionCreateManyGoalInputEnvelope
    connect?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
    unset?: boolean
  }

  export type UserUpdateOneRequiredWithoutGoalsNestedInput = {
    create?: XOR<UserCreateWithoutGoalsInput, UserUncheckedCreateWithoutGoalsInput>
    connectOrCreate?: UserCreateOrConnectWithoutGoalsInput
    upsert?: UserUpsertWithoutGoalsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutGoalsInput, UserUpdateWithoutGoalsInput>, UserUncheckedUpdateWithoutGoalsInput>
  }

  export type GoalActionUpdateManyWithoutGoalNestedInput = {
    create?: XOR<GoalActionCreateWithoutGoalInput, GoalActionUncheckedCreateWithoutGoalInput> | GoalActionCreateWithoutGoalInput[] | GoalActionUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalActionCreateOrConnectWithoutGoalInput | GoalActionCreateOrConnectWithoutGoalInput[]
    upsert?: GoalActionUpsertWithWhereUniqueWithoutGoalInput | GoalActionUpsertWithWhereUniqueWithoutGoalInput[]
    createMany?: GoalActionCreateManyGoalInputEnvelope
    set?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    disconnect?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    delete?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    connect?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    update?: GoalActionUpdateWithWhereUniqueWithoutGoalInput | GoalActionUpdateWithWhereUniqueWithoutGoalInput[]
    updateMany?: GoalActionUpdateManyWithWhereWithoutGoalInput | GoalActionUpdateManyWithWhereWithoutGoalInput[]
    deleteMany?: GoalActionScalarWhereInput | GoalActionScalarWhereInput[]
  }

  export type GoalActionUncheckedUpdateManyWithoutGoalNestedInput = {
    create?: XOR<GoalActionCreateWithoutGoalInput, GoalActionUncheckedCreateWithoutGoalInput> | GoalActionCreateWithoutGoalInput[] | GoalActionUncheckedCreateWithoutGoalInput[]
    connectOrCreate?: GoalActionCreateOrConnectWithoutGoalInput | GoalActionCreateOrConnectWithoutGoalInput[]
    upsert?: GoalActionUpsertWithWhereUniqueWithoutGoalInput | GoalActionUpsertWithWhereUniqueWithoutGoalInput[]
    createMany?: GoalActionCreateManyGoalInputEnvelope
    set?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    disconnect?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    delete?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    connect?: GoalActionWhereUniqueInput | GoalActionWhereUniqueInput[]
    update?: GoalActionUpdateWithWhereUniqueWithoutGoalInput | GoalActionUpdateWithWhereUniqueWithoutGoalInput[]
    updateMany?: GoalActionUpdateManyWithWhereWithoutGoalInput | GoalActionUpdateManyWithWhereWithoutGoalInput[]
    deleteMany?: GoalActionScalarWhereInput | GoalActionScalarWhereInput[]
  }

  export type GoalActionCreatedimensionsInput = {
    set: string[]
  }

  export type GoalActionCreateattributesInput = {
    set: string[]
  }

  export type GoalCreateNestedOneWithoutActionsInput = {
    create?: XOR<GoalCreateWithoutActionsInput, GoalUncheckedCreateWithoutActionsInput>
    connectOrCreate?: GoalCreateOrConnectWithoutActionsInput
    connect?: GoalWhereUniqueInput
  }

  export type TaskCreateNestedManyWithoutGoalActionInput = {
    create?: XOR<TaskCreateWithoutGoalActionInput, TaskUncheckedCreateWithoutGoalActionInput> | TaskCreateWithoutGoalActionInput[] | TaskUncheckedCreateWithoutGoalActionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutGoalActionInput | TaskCreateOrConnectWithoutGoalActionInput[]
    createMany?: TaskCreateManyGoalActionInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type TaskUncheckedCreateNestedManyWithoutGoalActionInput = {
    create?: XOR<TaskCreateWithoutGoalActionInput, TaskUncheckedCreateWithoutGoalActionInput> | TaskCreateWithoutGoalActionInput[] | TaskUncheckedCreateWithoutGoalActionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutGoalActionInput | TaskCreateOrConnectWithoutGoalActionInput[]
    createMany?: TaskCreateManyGoalActionInputEnvelope
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
  }

  export type GoalActionUpdatedimensionsInput = {
    set?: string[]
    push?: string | string[]
  }

  export type GoalActionUpdateattributesInput = {
    set?: string[]
    push?: string | string[]
  }

  export type GoalUpdateOneRequiredWithoutActionsNestedInput = {
    create?: XOR<GoalCreateWithoutActionsInput, GoalUncheckedCreateWithoutActionsInput>
    connectOrCreate?: GoalCreateOrConnectWithoutActionsInput
    upsert?: GoalUpsertWithoutActionsInput
    connect?: GoalWhereUniqueInput
    update?: XOR<XOR<GoalUpdateToOneWithWhereWithoutActionsInput, GoalUpdateWithoutActionsInput>, GoalUncheckedUpdateWithoutActionsInput>
  }

  export type TaskUpdateManyWithoutGoalActionNestedInput = {
    create?: XOR<TaskCreateWithoutGoalActionInput, TaskUncheckedCreateWithoutGoalActionInput> | TaskCreateWithoutGoalActionInput[] | TaskUncheckedCreateWithoutGoalActionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutGoalActionInput | TaskCreateOrConnectWithoutGoalActionInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutGoalActionInput | TaskUpsertWithWhereUniqueWithoutGoalActionInput[]
    createMany?: TaskCreateManyGoalActionInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutGoalActionInput | TaskUpdateWithWhereUniqueWithoutGoalActionInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutGoalActionInput | TaskUpdateManyWithWhereWithoutGoalActionInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type TaskUncheckedUpdateManyWithoutGoalActionNestedInput = {
    create?: XOR<TaskCreateWithoutGoalActionInput, TaskUncheckedCreateWithoutGoalActionInput> | TaskCreateWithoutGoalActionInput[] | TaskUncheckedCreateWithoutGoalActionInput[]
    connectOrCreate?: TaskCreateOrConnectWithoutGoalActionInput | TaskCreateOrConnectWithoutGoalActionInput[]
    upsert?: TaskUpsertWithWhereUniqueWithoutGoalActionInput | TaskUpsertWithWhereUniqueWithoutGoalActionInput[]
    createMany?: TaskCreateManyGoalActionInputEnvelope
    set?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    disconnect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    delete?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    connect?: TaskWhereUniqueInput | TaskWhereUniqueInput[]
    update?: TaskUpdateWithWhereUniqueWithoutGoalActionInput | TaskUpdateWithWhereUniqueWithoutGoalActionInput[]
    updateMany?: TaskUpdateManyWithWhereWithoutGoalActionInput | TaskUpdateManyWithWhereWithoutGoalActionInput[]
    deleteMany?: TaskScalarWhereInput | TaskScalarWhereInput[]
  }

  export type GoalActionCreateNestedOneWithoutTasksInput = {
    create?: XOR<GoalActionCreateWithoutTasksInput, GoalActionUncheckedCreateWithoutTasksInput>
    connectOrCreate?: GoalActionCreateOrConnectWithoutTasksInput
    connect?: GoalActionWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
    unset?: boolean
  }

  export type GoalActionUpdateOneRequiredWithoutTasksNestedInput = {
    create?: XOR<GoalActionCreateWithoutTasksInput, GoalActionUncheckedCreateWithoutTasksInput>
    connectOrCreate?: GoalActionCreateOrConnectWithoutTasksInput
    upsert?: GoalActionUpsertWithoutTasksInput
    connect?: GoalActionWhereUniqueInput
    update?: XOR<XOR<GoalActionUpdateToOneWithWhereWithoutTasksInput, GoalActionUpdateWithoutTasksInput>, GoalActionUncheckedUpdateWithoutTasksInput>
  }

  export type ChatMessageCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type UserCreateNestedOneWithoutChatSessionsInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
  }

  export type ChatMessageUncheckedCreateNestedManyWithoutSessionInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
  }

  export type ChatMessageUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSessionInput | ChatMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSessionInput | ChatMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSessionInput | ChatMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type UserUpdateOneRequiredWithoutChatSessionsNestedInput = {
    create?: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    connectOrCreate?: UserCreateOrConnectWithoutChatSessionsInput
    upsert?: UserUpsertWithoutChatSessionsInput
    connect?: UserWhereUniqueInput
    update?: XOR<XOR<UserUpdateToOneWithWhereWithoutChatSessionsInput, UserUpdateWithoutChatSessionsInput>, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type ChatMessageUncheckedUpdateManyWithoutSessionNestedInput = {
    create?: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput> | ChatMessageCreateWithoutSessionInput[] | ChatMessageUncheckedCreateWithoutSessionInput[]
    connectOrCreate?: ChatMessageCreateOrConnectWithoutSessionInput | ChatMessageCreateOrConnectWithoutSessionInput[]
    upsert?: ChatMessageUpsertWithWhereUniqueWithoutSessionInput | ChatMessageUpsertWithWhereUniqueWithoutSessionInput[]
    createMany?: ChatMessageCreateManySessionInputEnvelope
    set?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    disconnect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    delete?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    connect?: ChatMessageWhereUniqueInput | ChatMessageWhereUniqueInput[]
    update?: ChatMessageUpdateWithWhereUniqueWithoutSessionInput | ChatMessageUpdateWithWhereUniqueWithoutSessionInput[]
    updateMany?: ChatMessageUpdateManyWithWhereWithoutSessionInput | ChatMessageUpdateManyWithWhereWithoutSessionInput[]
    deleteMany?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
  }

  export type ChatSessionCreateNestedOneWithoutMessagesInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
  }

  export type ChatSessionUpdateOneRequiredWithoutMessagesNestedInput = {
    create?: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    connectOrCreate?: ChatSessionCreateOrConnectWithoutMessagesInput
    upsert?: ChatSessionUpsertWithoutMessagesInput
    connect?: ChatSessionWhereUniqueInput
    update?: XOR<XOR<ChatSessionUpdateToOneWithWhereWithoutMessagesInput, ChatSessionUpdateWithoutMessagesInput>, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
    isSet?: boolean
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[] | ListStringFieldRefInput<$PrismaModel>
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel>
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    notIn?: string[] | ListStringFieldRefInput<$PrismaModel> | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel> | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel>
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[] | ListIntFieldRefInput<$PrismaModel>
    notIn?: number[] | ListIntFieldRefInput<$PrismaModel>
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
  }
  export type NestedJsonNullableFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonNullableFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonNullableFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonNullableFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonNullableFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    isSet?: boolean
  }
  export type NestedJsonFilter<$PrismaModel = never> = 
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel>
  }

  export type DimensionScoreWhereInput = {
    AND?: DimensionScoreWhereInput | DimensionScoreWhereInput[]
    OR?: DimensionScoreWhereInput[]
    NOT?: DimensionScoreWhereInput | DimensionScoreWhereInput[]
    dimensionId?: StringFilter<"DimensionScore"> | string
    score?: FloatFilter<"DimensionScore"> | number
    trend?: StringFilter<"DimensionScore"> | string
    confidence?: FloatNullableFilter<"DimensionScore"> | number | null
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[] | ListFloatFieldRefInput<$PrismaModel>
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel>
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
    isSet?: boolean
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    notIn?: Date[] | string[] | ListDateTimeFieldRefInput<$PrismaModel> | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
    isSet?: boolean
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    notIn?: number[] | ListFloatFieldRefInput<$PrismaModel> | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
    isSet?: boolean
  }

  export type UserAttributeCreateWithoutUserInput = {
    id?: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
    dimension: DimensionCreateNestedOneWithoutAttributesInput
  }

  export type UserAttributeUncheckedCreateWithoutUserInput = {
    id?: string
    dimensionId: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type UserAttributeCreateOrConnectWithoutUserInput = {
    where: UserAttributeWhereUniqueInput
    create: XOR<UserAttributeCreateWithoutUserInput, UserAttributeUncheckedCreateWithoutUserInput>
  }

  export type UserAttributeCreateManyUserInputEnvelope = {
    data: UserAttributeCreateManyUserInput | UserAttributeCreateManyUserInput[]
  }

  export type DimensionInputCreateWithoutUserInput = {
    id?: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
    dimension: DimensionCreateNestedOneWithoutDimensionInputsInput
  }

  export type DimensionInputUncheckedCreateWithoutUserInput = {
    id?: string
    dimensionId: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
  }

  export type DimensionInputCreateOrConnectWithoutUserInput = {
    where: DimensionInputWhereUniqueInput
    create: XOR<DimensionInputCreateWithoutUserInput, DimensionInputUncheckedCreateWithoutUserInput>
  }

  export type DimensionInputCreateManyUserInputEnvelope = {
    data: DimensionInputCreateManyUserInput | DimensionInputCreateManyUserInput[]
  }

  export type LifeStateCreateWithoutUserInput = {
    id?: string
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp?: Date | string
    triggeredBy?: string | null
    insights?: InputJsonValue | null
    scores?: XOR<DimensionScoreListCreateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateUncheckedCreateWithoutUserInput = {
    id?: string
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp?: Date | string
    triggeredBy?: string | null
    insights?: InputJsonValue | null
    scores?: XOR<DimensionScoreListCreateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateCreateOrConnectWithoutUserInput = {
    where: LifeStateWhereUniqueInput
    create: XOR<LifeStateCreateWithoutUserInput, LifeStateUncheckedCreateWithoutUserInput>
  }

  export type LifeStateCreateManyUserInputEnvelope = {
    data: LifeStateCreateManyUserInput | LifeStateCreateManyUserInput[]
  }

  export type LifeEventCreateWithoutUserInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    impact?: InputJsonValue | null
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type LifeEventUncheckedCreateWithoutUserInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    impact?: InputJsonValue | null
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type LifeEventCreateOrConnectWithoutUserInput = {
    where: LifeEventWhereUniqueInput
    create: XOR<LifeEventCreateWithoutUserInput, LifeEventUncheckedCreateWithoutUserInput>
  }

  export type LifeEventCreateManyUserInputEnvelope = {
    data: LifeEventCreateManyUserInput | LifeEventCreateManyUserInput[]
  }

  export type GoalCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    actions?: GoalActionCreateNestedManyWithoutGoalInput
  }

  export type GoalUncheckedCreateWithoutUserInput = {
    id?: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    actions?: GoalActionUncheckedCreateNestedManyWithoutGoalInput
  }

  export type GoalCreateOrConnectWithoutUserInput = {
    where: GoalWhereUniqueInput
    create: XOR<GoalCreateWithoutUserInput, GoalUncheckedCreateWithoutUserInput>
  }

  export type GoalCreateManyUserInputEnvelope = {
    data: GoalCreateManyUserInput | GoalCreateManyUserInput[]
  }

  export type ChatSessionCreateWithoutUserInput = {
    id?: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionUncheckedCreateWithoutUserInput = {
    id?: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
    messages?: ChatMessageUncheckedCreateNestedManyWithoutSessionInput
  }

  export type ChatSessionCreateOrConnectWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionCreateManyUserInputEnvelope = {
    data: ChatSessionCreateManyUserInput | ChatSessionCreateManyUserInput[]
  }

  export type UserAttributeUpsertWithWhereUniqueWithoutUserInput = {
    where: UserAttributeWhereUniqueInput
    update: XOR<UserAttributeUpdateWithoutUserInput, UserAttributeUncheckedUpdateWithoutUserInput>
    create: XOR<UserAttributeCreateWithoutUserInput, UserAttributeUncheckedCreateWithoutUserInput>
  }

  export type UserAttributeUpdateWithWhereUniqueWithoutUserInput = {
    where: UserAttributeWhereUniqueInput
    data: XOR<UserAttributeUpdateWithoutUserInput, UserAttributeUncheckedUpdateWithoutUserInput>
  }

  export type UserAttributeUpdateManyWithWhereWithoutUserInput = {
    where: UserAttributeScalarWhereInput
    data: XOR<UserAttributeUpdateManyMutationInput, UserAttributeUncheckedUpdateManyWithoutUserInput>
  }

  export type UserAttributeScalarWhereInput = {
    AND?: UserAttributeScalarWhereInput | UserAttributeScalarWhereInput[]
    OR?: UserAttributeScalarWhereInput[]
    NOT?: UserAttributeScalarWhereInput | UserAttributeScalarWhereInput[]
    id?: StringFilter<"UserAttribute"> | string
    userId?: StringFilter<"UserAttribute"> | string
    dimensionId?: StringFilter<"UserAttribute"> | string
    name?: StringFilter<"UserAttribute"> | string
    category?: StringFilter<"UserAttribute"> | string
    metadata?: JsonNullableFilter<"UserAttribute">
    createdAt?: DateTimeFilter<"UserAttribute"> | Date | string
  }

  export type DimensionInputUpsertWithWhereUniqueWithoutUserInput = {
    where: DimensionInputWhereUniqueInput
    update: XOR<DimensionInputUpdateWithoutUserInput, DimensionInputUncheckedUpdateWithoutUserInput>
    create: XOR<DimensionInputCreateWithoutUserInput, DimensionInputUncheckedCreateWithoutUserInput>
  }

  export type DimensionInputUpdateWithWhereUniqueWithoutUserInput = {
    where: DimensionInputWhereUniqueInput
    data: XOR<DimensionInputUpdateWithoutUserInput, DimensionInputUncheckedUpdateWithoutUserInput>
  }

  export type DimensionInputUpdateManyWithWhereWithoutUserInput = {
    where: DimensionInputScalarWhereInput
    data: XOR<DimensionInputUpdateManyMutationInput, DimensionInputUncheckedUpdateManyWithoutUserInput>
  }

  export type DimensionInputScalarWhereInput = {
    AND?: DimensionInputScalarWhereInput | DimensionInputScalarWhereInput[]
    OR?: DimensionInputScalarWhereInput[]
    NOT?: DimensionInputScalarWhereInput | DimensionInputScalarWhereInput[]
    id?: StringFilter<"DimensionInput"> | string
    userId?: StringFilter<"DimensionInput"> | string
    dimensionId?: StringFilter<"DimensionInput"> | string
    inputType?: StringFilter<"DimensionInput"> | string
    subType?: StringNullableFilter<"DimensionInput"> | string | null
    valueJson?: JsonFilter<"DimensionInput">
    source?: StringFilter<"DimensionInput"> | string
    createdAt?: DateTimeFilter<"DimensionInput"> | Date | string
  }

  export type LifeStateUpsertWithWhereUniqueWithoutUserInput = {
    where: LifeStateWhereUniqueInput
    update: XOR<LifeStateUpdateWithoutUserInput, LifeStateUncheckedUpdateWithoutUserInput>
    create: XOR<LifeStateCreateWithoutUserInput, LifeStateUncheckedCreateWithoutUserInput>
  }

  export type LifeStateUpdateWithWhereUniqueWithoutUserInput = {
    where: LifeStateWhereUniqueInput
    data: XOR<LifeStateUpdateWithoutUserInput, LifeStateUncheckedUpdateWithoutUserInput>
  }

  export type LifeStateUpdateManyWithWhereWithoutUserInput = {
    where: LifeStateScalarWhereInput
    data: XOR<LifeStateUpdateManyMutationInput, LifeStateUncheckedUpdateManyWithoutUserInput>
  }

  export type LifeStateScalarWhereInput = {
    AND?: LifeStateScalarWhereInput | LifeStateScalarWhereInput[]
    OR?: LifeStateScalarWhereInput[]
    NOT?: LifeStateScalarWhereInput | LifeStateScalarWhereInput[]
    id?: StringFilter<"LifeState"> | string
    userId?: StringFilter<"LifeState"> | string
    lifeScore?: FloatFilter<"LifeState"> | number
    balanceScore?: FloatFilter<"LifeState"> | number
    alignmentScore?: FloatFilter<"LifeState"> | number
    energyIndex?: FloatFilter<"LifeState"> | number
    timestamp?: DateTimeFilter<"LifeState"> | Date | string
    triggeredBy?: StringNullableFilter<"LifeState"> | string | null
    insights?: JsonNullableFilter<"LifeState">
  }

  export type LifeEventUpsertWithWhereUniqueWithoutUserInput = {
    where: LifeEventWhereUniqueInput
    update: XOR<LifeEventUpdateWithoutUserInput, LifeEventUncheckedUpdateWithoutUserInput>
    create: XOR<LifeEventCreateWithoutUserInput, LifeEventUncheckedCreateWithoutUserInput>
  }

  export type LifeEventUpdateWithWhereUniqueWithoutUserInput = {
    where: LifeEventWhereUniqueInput
    data: XOR<LifeEventUpdateWithoutUserInput, LifeEventUncheckedUpdateWithoutUserInput>
  }

  export type LifeEventUpdateManyWithWhereWithoutUserInput = {
    where: LifeEventScalarWhereInput
    data: XOR<LifeEventUpdateManyMutationInput, LifeEventUncheckedUpdateManyWithoutUserInput>
  }

  export type LifeEventScalarWhereInput = {
    AND?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
    OR?: LifeEventScalarWhereInput[]
    NOT?: LifeEventScalarWhereInput | LifeEventScalarWhereInput[]
    id?: StringFilter<"LifeEvent"> | string
    userId?: StringFilter<"LifeEvent"> | string
    type?: StringFilter<"LifeEvent"> | string
    title?: StringFilter<"LifeEvent"> | string
    description?: StringNullableFilter<"LifeEvent"> | string | null
    date?: DateTimeFilter<"LifeEvent"> | Date | string
    impact?: JsonNullableFilter<"LifeEvent">
    metadata?: JsonNullableFilter<"LifeEvent">
    createdAt?: DateTimeFilter<"LifeEvent"> | Date | string
  }

  export type GoalUpsertWithWhereUniqueWithoutUserInput = {
    where: GoalWhereUniqueInput
    update: XOR<GoalUpdateWithoutUserInput, GoalUncheckedUpdateWithoutUserInput>
    create: XOR<GoalCreateWithoutUserInput, GoalUncheckedCreateWithoutUserInput>
  }

  export type GoalUpdateWithWhereUniqueWithoutUserInput = {
    where: GoalWhereUniqueInput
    data: XOR<GoalUpdateWithoutUserInput, GoalUncheckedUpdateWithoutUserInput>
  }

  export type GoalUpdateManyWithWhereWithoutUserInput = {
    where: GoalScalarWhereInput
    data: XOR<GoalUpdateManyMutationInput, GoalUncheckedUpdateManyWithoutUserInput>
  }

  export type GoalScalarWhereInput = {
    AND?: GoalScalarWhereInput | GoalScalarWhereInput[]
    OR?: GoalScalarWhereInput[]
    NOT?: GoalScalarWhereInput | GoalScalarWhereInput[]
    id?: StringFilter<"Goal"> | string
    userId?: StringFilter<"Goal"> | string
    title?: StringFilter<"Goal"> | string
    description?: StringNullableFilter<"Goal"> | string | null
    dimensionId?: StringNullableFilter<"Goal"> | string | null
    progress?: FloatFilter<"Goal"> | number
    status?: StringFilter<"Goal"> | string
    createdAt?: DateTimeFilter<"Goal"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Goal"> | Date | string | null
  }

  export type ChatSessionUpsertWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    update: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
    create: XOR<ChatSessionCreateWithoutUserInput, ChatSessionUncheckedCreateWithoutUserInput>
  }

  export type ChatSessionUpdateWithWhereUniqueWithoutUserInput = {
    where: ChatSessionWhereUniqueInput
    data: XOR<ChatSessionUpdateWithoutUserInput, ChatSessionUncheckedUpdateWithoutUserInput>
  }

  export type ChatSessionUpdateManyWithWhereWithoutUserInput = {
    where: ChatSessionScalarWhereInput
    data: XOR<ChatSessionUpdateManyMutationInput, ChatSessionUncheckedUpdateManyWithoutUserInput>
  }

  export type ChatSessionScalarWhereInput = {
    AND?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    OR?: ChatSessionScalarWhereInput[]
    NOT?: ChatSessionScalarWhereInput | ChatSessionScalarWhereInput[]
    id?: StringFilter<"ChatSession"> | string
    userId?: StringFilter<"ChatSession"> | string
    context?: StringFilter<"ChatSession"> | string
    createdAt?: DateTimeFilter<"ChatSession"> | Date | string
    updatedAt?: DateTimeFilter<"ChatSession"> | Date | string
  }

  export type UserAttributeCreateWithoutDimensionInput = {
    id?: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutAttributesInput
  }

  export type UserAttributeUncheckedCreateWithoutDimensionInput = {
    id?: string
    userId: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type UserAttributeCreateOrConnectWithoutDimensionInput = {
    where: UserAttributeWhereUniqueInput
    create: XOR<UserAttributeCreateWithoutDimensionInput, UserAttributeUncheckedCreateWithoutDimensionInput>
  }

  export type UserAttributeCreateManyDimensionInputEnvelope = {
    data: UserAttributeCreateManyDimensionInput | UserAttributeCreateManyDimensionInput[]
  }

  export type DimensionInputCreateWithoutDimensionInput = {
    id?: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
    user: UserCreateNestedOneWithoutDimensionInputsInput
  }

  export type DimensionInputUncheckedCreateWithoutDimensionInput = {
    id?: string
    userId: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
  }

  export type DimensionInputCreateOrConnectWithoutDimensionInput = {
    where: DimensionInputWhereUniqueInput
    create: XOR<DimensionInputCreateWithoutDimensionInput, DimensionInputUncheckedCreateWithoutDimensionInput>
  }

  export type DimensionInputCreateManyDimensionInputEnvelope = {
    data: DimensionInputCreateManyDimensionInput | DimensionInputCreateManyDimensionInput[]
  }

  export type UserAttributeUpsertWithWhereUniqueWithoutDimensionInput = {
    where: UserAttributeWhereUniqueInput
    update: XOR<UserAttributeUpdateWithoutDimensionInput, UserAttributeUncheckedUpdateWithoutDimensionInput>
    create: XOR<UserAttributeCreateWithoutDimensionInput, UserAttributeUncheckedCreateWithoutDimensionInput>
  }

  export type UserAttributeUpdateWithWhereUniqueWithoutDimensionInput = {
    where: UserAttributeWhereUniqueInput
    data: XOR<UserAttributeUpdateWithoutDimensionInput, UserAttributeUncheckedUpdateWithoutDimensionInput>
  }

  export type UserAttributeUpdateManyWithWhereWithoutDimensionInput = {
    where: UserAttributeScalarWhereInput
    data: XOR<UserAttributeUpdateManyMutationInput, UserAttributeUncheckedUpdateManyWithoutDimensionInput>
  }

  export type DimensionInputUpsertWithWhereUniqueWithoutDimensionInput = {
    where: DimensionInputWhereUniqueInput
    update: XOR<DimensionInputUpdateWithoutDimensionInput, DimensionInputUncheckedUpdateWithoutDimensionInput>
    create: XOR<DimensionInputCreateWithoutDimensionInput, DimensionInputUncheckedCreateWithoutDimensionInput>
  }

  export type DimensionInputUpdateWithWhereUniqueWithoutDimensionInput = {
    where: DimensionInputWhereUniqueInput
    data: XOR<DimensionInputUpdateWithoutDimensionInput, DimensionInputUncheckedUpdateWithoutDimensionInput>
  }

  export type DimensionInputUpdateManyWithWhereWithoutDimensionInput = {
    where: DimensionInputScalarWhereInput
    data: XOR<DimensionInputUpdateManyMutationInput, DimensionInputUncheckedUpdateManyWithoutDimensionInput>
  }

  export type UserCreateWithoutAttributesInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dimensionInputs?: DimensionInputCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventCreateNestedManyWithoutUserInput
    goals?: GoalCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutAttributesInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateUncheckedCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventUncheckedCreateNestedManyWithoutUserInput
    goals?: GoalUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutAttributesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutAttributesInput, UserUncheckedCreateWithoutAttributesInput>
  }

  export type DimensionCreateWithoutAttributesInput = {
    id?: string
    name: string
    label: string
    category: string
    description?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    dimensionInputs?: DimensionInputCreateNestedManyWithoutDimensionInput
  }

  export type DimensionUncheckedCreateWithoutAttributesInput = {
    id?: string
    name: string
    label: string
    category: string
    description?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutDimensionInput
  }

  export type DimensionCreateOrConnectWithoutAttributesInput = {
    where: DimensionWhereUniqueInput
    create: XOR<DimensionCreateWithoutAttributesInput, DimensionUncheckedCreateWithoutAttributesInput>
  }

  export type UserUpsertWithoutAttributesInput = {
    update: XOR<UserUpdateWithoutAttributesInput, UserUncheckedUpdateWithoutAttributesInput>
    create: XOR<UserCreateWithoutAttributesInput, UserUncheckedCreateWithoutAttributesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutAttributesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutAttributesInput, UserUncheckedUpdateWithoutAttributesInput>
  }

  export type UserUpdateWithoutAttributesInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dimensionInputs?: DimensionInputUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUpdateManyWithoutUserNestedInput
    goals?: GoalUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutAttributesInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUncheckedUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUncheckedUpdateManyWithoutUserNestedInput
    goals?: GoalUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DimensionUpsertWithoutAttributesInput = {
    update: XOR<DimensionUpdateWithoutAttributesInput, DimensionUncheckedUpdateWithoutAttributesInput>
    create: XOR<DimensionCreateWithoutAttributesInput, DimensionUncheckedCreateWithoutAttributesInput>
    where?: DimensionWhereInput
  }

  export type DimensionUpdateToOneWithWhereWithoutAttributesInput = {
    where?: DimensionWhereInput
    data: XOR<DimensionUpdateWithoutAttributesInput, DimensionUncheckedUpdateWithoutAttributesInput>
  }

  export type DimensionUpdateWithoutAttributesInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dimensionInputs?: DimensionInputUpdateManyWithoutDimensionNestedInput
  }

  export type DimensionUncheckedUpdateWithoutAttributesInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutDimensionNestedInput
  }

  export type UserCreateWithoutDimensionInputsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventCreateNestedManyWithoutUserInput
    goals?: GoalCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutDimensionInputsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateUncheckedCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventUncheckedCreateNestedManyWithoutUserInput
    goals?: GoalUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutDimensionInputsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutDimensionInputsInput, UserUncheckedCreateWithoutDimensionInputsInput>
  }

  export type DimensionCreateWithoutDimensionInputsInput = {
    id?: string
    name: string
    label: string
    category: string
    description?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutDimensionInput
  }

  export type DimensionUncheckedCreateWithoutDimensionInputsInput = {
    id?: string
    name: string
    label: string
    category: string
    description?: string | null
    sortOrder?: number
    isActive?: boolean
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutDimensionInput
  }

  export type DimensionCreateOrConnectWithoutDimensionInputsInput = {
    where: DimensionWhereUniqueInput
    create: XOR<DimensionCreateWithoutDimensionInputsInput, DimensionUncheckedCreateWithoutDimensionInputsInput>
  }

  export type UserUpsertWithoutDimensionInputsInput = {
    update: XOR<UserUpdateWithoutDimensionInputsInput, UserUncheckedUpdateWithoutDimensionInputsInput>
    create: XOR<UserCreateWithoutDimensionInputsInput, UserUncheckedCreateWithoutDimensionInputsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutDimensionInputsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutDimensionInputsInput, UserUncheckedUpdateWithoutDimensionInputsInput>
  }

  export type UserUpdateWithoutDimensionInputsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUpdateManyWithoutUserNestedInput
    goals?: GoalUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutDimensionInputsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUncheckedUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUncheckedUpdateManyWithoutUserNestedInput
    goals?: GoalUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type DimensionUpsertWithoutDimensionInputsInput = {
    update: XOR<DimensionUpdateWithoutDimensionInputsInput, DimensionUncheckedUpdateWithoutDimensionInputsInput>
    create: XOR<DimensionCreateWithoutDimensionInputsInput, DimensionUncheckedCreateWithoutDimensionInputsInput>
    where?: DimensionWhereInput
  }

  export type DimensionUpdateToOneWithWhereWithoutDimensionInputsInput = {
    where?: DimensionWhereInput
    data: XOR<DimensionUpdateWithoutDimensionInputsInput, DimensionUncheckedUpdateWithoutDimensionInputsInput>
  }

  export type DimensionUpdateWithoutDimensionInputsInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutDimensionNestedInput
  }

  export type DimensionUncheckedUpdateWithoutDimensionInputsInput = {
    name?: StringFieldUpdateOperationsInput | string
    label?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    sortOrder?: IntFieldUpdateOperationsInput | number
    isActive?: BoolFieldUpdateOperationsInput | boolean
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutDimensionNestedInput
  }

  export type UserCreateWithoutLifeStatesInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventCreateNestedManyWithoutUserInput
    goals?: GoalCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLifeStatesInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventUncheckedCreateNestedManyWithoutUserInput
    goals?: GoalUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLifeStatesInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLifeStatesInput, UserUncheckedCreateWithoutLifeStatesInput>
  }

  export type DimensionScoreUpdateManyInput = {
    where: DimensionScoreWhereInput
    data: DimensionScoreUpdateInput
  }

  export type DimensionScoreDeleteManyInput = {
    where: DimensionScoreWhereInput
  }

  export type UserUpsertWithoutLifeStatesInput = {
    update: XOR<UserUpdateWithoutLifeStatesInput, UserUncheckedUpdateWithoutLifeStatesInput>
    create: XOR<UserCreateWithoutLifeStatesInput, UserUncheckedCreateWithoutLifeStatesInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLifeStatesInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLifeStatesInput, UserUncheckedUpdateWithoutLifeStatesInput>
  }

  export type UserUpdateWithoutLifeStatesInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUpdateManyWithoutUserNestedInput
    goals?: GoalUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLifeStatesInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUncheckedUpdateManyWithoutUserNestedInput
    goals?: GoalUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutLifeEventsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateCreateNestedManyWithoutUserInput
    goals?: GoalCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutLifeEventsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateUncheckedCreateNestedManyWithoutUserInput
    goals?: GoalUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutLifeEventsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutLifeEventsInput, UserUncheckedCreateWithoutLifeEventsInput>
  }

  export type UserUpsertWithoutLifeEventsInput = {
    update: XOR<UserUpdateWithoutLifeEventsInput, UserUncheckedUpdateWithoutLifeEventsInput>
    create: XOR<UserCreateWithoutLifeEventsInput, UserUncheckedCreateWithoutLifeEventsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutLifeEventsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutLifeEventsInput, UserUncheckedUpdateWithoutLifeEventsInput>
  }

  export type UserUpdateWithoutLifeEventsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUpdateManyWithoutUserNestedInput
    goals?: GoalUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutLifeEventsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUncheckedUpdateManyWithoutUserNestedInput
    goals?: GoalUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type UserCreateWithoutGoalsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutGoalsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateUncheckedCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventUncheckedCreateNestedManyWithoutUserInput
    chatSessions?: ChatSessionUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutGoalsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutGoalsInput, UserUncheckedCreateWithoutGoalsInput>
  }

  export type GoalActionCreateWithoutGoalInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    tasks?: TaskCreateNestedManyWithoutGoalActionInput
  }

  export type GoalActionUncheckedCreateWithoutGoalInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    tasks?: TaskUncheckedCreateNestedManyWithoutGoalActionInput
  }

  export type GoalActionCreateOrConnectWithoutGoalInput = {
    where: GoalActionWhereUniqueInput
    create: XOR<GoalActionCreateWithoutGoalInput, GoalActionUncheckedCreateWithoutGoalInput>
  }

  export type GoalActionCreateManyGoalInputEnvelope = {
    data: GoalActionCreateManyGoalInput | GoalActionCreateManyGoalInput[]
  }

  export type UserUpsertWithoutGoalsInput = {
    update: XOR<UserUpdateWithoutGoalsInput, UserUncheckedUpdateWithoutGoalsInput>
    create: XOR<UserCreateWithoutGoalsInput, UserUncheckedCreateWithoutGoalsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutGoalsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutGoalsInput, UserUncheckedUpdateWithoutGoalsInput>
  }

  export type UserUpdateWithoutGoalsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutGoalsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUncheckedUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUncheckedUpdateManyWithoutUserNestedInput
    chatSessions?: ChatSessionUncheckedUpdateManyWithoutUserNestedInput
  }

  export type GoalActionUpsertWithWhereUniqueWithoutGoalInput = {
    where: GoalActionWhereUniqueInput
    update: XOR<GoalActionUpdateWithoutGoalInput, GoalActionUncheckedUpdateWithoutGoalInput>
    create: XOR<GoalActionCreateWithoutGoalInput, GoalActionUncheckedCreateWithoutGoalInput>
  }

  export type GoalActionUpdateWithWhereUniqueWithoutGoalInput = {
    where: GoalActionWhereUniqueInput
    data: XOR<GoalActionUpdateWithoutGoalInput, GoalActionUncheckedUpdateWithoutGoalInput>
  }

  export type GoalActionUpdateManyWithWhereWithoutGoalInput = {
    where: GoalActionScalarWhereInput
    data: XOR<GoalActionUpdateManyMutationInput, GoalActionUncheckedUpdateManyWithoutGoalInput>
  }

  export type GoalActionScalarWhereInput = {
    AND?: GoalActionScalarWhereInput | GoalActionScalarWhereInput[]
    OR?: GoalActionScalarWhereInput[]
    NOT?: GoalActionScalarWhereInput | GoalActionScalarWhereInput[]
    id?: StringFilter<"GoalAction"> | string
    goalId?: StringFilter<"GoalAction"> | string
    title?: StringFilter<"GoalAction"> | string
    description?: StringNullableFilter<"GoalAction"> | string | null
    isCompleted?: BoolFilter<"GoalAction"> | boolean
    targetDate?: DateTimeNullableFilter<"GoalAction"> | Date | string | null
    dimensions?: StringNullableListFilter<"GoalAction">
    attributes?: StringNullableListFilter<"GoalAction">
    impact?: JsonNullableFilter<"GoalAction">
    createdAt?: DateTimeFilter<"GoalAction"> | Date | string
    updatedAt?: DateTimeNullableFilter<"GoalAction"> | Date | string | null
  }

  export type GoalCreateWithoutActionsInput = {
    id?: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
    user: UserCreateNestedOneWithoutGoalsInput
  }

  export type GoalUncheckedCreateWithoutActionsInput = {
    id?: string
    userId: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type GoalCreateOrConnectWithoutActionsInput = {
    where: GoalWhereUniqueInput
    create: XOR<GoalCreateWithoutActionsInput, GoalUncheckedCreateWithoutActionsInput>
  }

  export type TaskCreateWithoutGoalActionInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    startDate?: Date | string | null
    endDate?: Date | string | null
    estimatedHours?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type TaskUncheckedCreateWithoutGoalActionInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    startDate?: Date | string | null
    endDate?: Date | string | null
    estimatedHours?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type TaskCreateOrConnectWithoutGoalActionInput = {
    where: TaskWhereUniqueInput
    create: XOR<TaskCreateWithoutGoalActionInput, TaskUncheckedCreateWithoutGoalActionInput>
  }

  export type TaskCreateManyGoalActionInputEnvelope = {
    data: TaskCreateManyGoalActionInput | TaskCreateManyGoalActionInput[]
  }

  export type GoalUpsertWithoutActionsInput = {
    update: XOR<GoalUpdateWithoutActionsInput, GoalUncheckedUpdateWithoutActionsInput>
    create: XOR<GoalCreateWithoutActionsInput, GoalUncheckedCreateWithoutActionsInput>
    where?: GoalWhereInput
  }

  export type GoalUpdateToOneWithWhereWithoutActionsInput = {
    where?: GoalWhereInput
    data: XOR<GoalUpdateWithoutActionsInput, GoalUncheckedUpdateWithoutActionsInput>
  }

  export type GoalUpdateWithoutActionsInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    user?: UserUpdateOneRequiredWithoutGoalsNestedInput
  }

  export type GoalUncheckedUpdateWithoutActionsInput = {
    userId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUpsertWithWhereUniqueWithoutGoalActionInput = {
    where: TaskWhereUniqueInput
    update: XOR<TaskUpdateWithoutGoalActionInput, TaskUncheckedUpdateWithoutGoalActionInput>
    create: XOR<TaskCreateWithoutGoalActionInput, TaskUncheckedCreateWithoutGoalActionInput>
  }

  export type TaskUpdateWithWhereUniqueWithoutGoalActionInput = {
    where: TaskWhereUniqueInput
    data: XOR<TaskUpdateWithoutGoalActionInput, TaskUncheckedUpdateWithoutGoalActionInput>
  }

  export type TaskUpdateManyWithWhereWithoutGoalActionInput = {
    where: TaskScalarWhereInput
    data: XOR<TaskUpdateManyMutationInput, TaskUncheckedUpdateManyWithoutGoalActionInput>
  }

  export type TaskScalarWhereInput = {
    AND?: TaskScalarWhereInput | TaskScalarWhereInput[]
    OR?: TaskScalarWhereInput[]
    NOT?: TaskScalarWhereInput | TaskScalarWhereInput[]
    id?: StringFilter<"Task"> | string
    goalActionId?: StringFilter<"Task"> | string
    title?: StringFilter<"Task"> | string
    description?: StringNullableFilter<"Task"> | string | null
    isCompleted?: BoolFilter<"Task"> | boolean
    startDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    endDate?: DateTimeNullableFilter<"Task"> | Date | string | null
    estimatedHours?: FloatNullableFilter<"Task"> | number | null
    createdAt?: DateTimeFilter<"Task"> | Date | string
    updatedAt?: DateTimeNullableFilter<"Task"> | Date | string | null
  }

  export type GoalActionCreateWithoutTasksInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
    goal: GoalCreateNestedOneWithoutActionsInput
  }

  export type GoalActionUncheckedCreateWithoutTasksInput = {
    id?: string
    goalId: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type GoalActionCreateOrConnectWithoutTasksInput = {
    where: GoalActionWhereUniqueInput
    create: XOR<GoalActionCreateWithoutTasksInput, GoalActionUncheckedCreateWithoutTasksInput>
  }

  export type GoalActionUpsertWithoutTasksInput = {
    update: XOR<GoalActionUpdateWithoutTasksInput, GoalActionUncheckedUpdateWithoutTasksInput>
    create: XOR<GoalActionCreateWithoutTasksInput, GoalActionUncheckedCreateWithoutTasksInput>
    where?: GoalActionWhereInput
  }

  export type GoalActionUpdateToOneWithWhereWithoutTasksInput = {
    where?: GoalActionWhereInput
    data: XOR<GoalActionUpdateWithoutTasksInput, GoalActionUncheckedUpdateWithoutTasksInput>
  }

  export type GoalActionUpdateWithoutTasksInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    goal?: GoalUpdateOneRequiredWithoutActionsNestedInput
  }

  export type GoalActionUncheckedUpdateWithoutTasksInput = {
    goalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatMessageCreateWithoutSessionInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUncheckedCreateWithoutSessionInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageCreateOrConnectWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    create: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput>
  }

  export type ChatMessageCreateManySessionInputEnvelope = {
    data: ChatMessageCreateManySessionInput | ChatMessageCreateManySessionInput[]
  }

  export type UserCreateWithoutChatSessionsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventCreateNestedManyWithoutUserInput
    goals?: GoalCreateNestedManyWithoutUserInput
  }

  export type UserUncheckedCreateWithoutChatSessionsInput = {
    id?: string
    email: string
    name?: string | null
    avatarUrl?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    attributes?: UserAttributeUncheckedCreateNestedManyWithoutUserInput
    dimensionInputs?: DimensionInputUncheckedCreateNestedManyWithoutUserInput
    lifeStates?: LifeStateUncheckedCreateNestedManyWithoutUserInput
    lifeEvents?: LifeEventUncheckedCreateNestedManyWithoutUserInput
    goals?: GoalUncheckedCreateNestedManyWithoutUserInput
  }

  export type UserCreateOrConnectWithoutChatSessionsInput = {
    where: UserWhereUniqueInput
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
  }

  export type ChatMessageUpsertWithWhereUniqueWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    update: XOR<ChatMessageUpdateWithoutSessionInput, ChatMessageUncheckedUpdateWithoutSessionInput>
    create: XOR<ChatMessageCreateWithoutSessionInput, ChatMessageUncheckedCreateWithoutSessionInput>
  }

  export type ChatMessageUpdateWithWhereUniqueWithoutSessionInput = {
    where: ChatMessageWhereUniqueInput
    data: XOR<ChatMessageUpdateWithoutSessionInput, ChatMessageUncheckedUpdateWithoutSessionInput>
  }

  export type ChatMessageUpdateManyWithWhereWithoutSessionInput = {
    where: ChatMessageScalarWhereInput
    data: XOR<ChatMessageUpdateManyMutationInput, ChatMessageUncheckedUpdateManyWithoutSessionInput>
  }

  export type ChatMessageScalarWhereInput = {
    AND?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    OR?: ChatMessageScalarWhereInput[]
    NOT?: ChatMessageScalarWhereInput | ChatMessageScalarWhereInput[]
    id?: StringFilter<"ChatMessage"> | string
    sessionId?: StringFilter<"ChatMessage"> | string
    role?: StringFilter<"ChatMessage"> | string
    content?: StringFilter<"ChatMessage"> | string
    createdAt?: DateTimeFilter<"ChatMessage"> | Date | string
  }

  export type UserUpsertWithoutChatSessionsInput = {
    update: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
    create: XOR<UserCreateWithoutChatSessionsInput, UserUncheckedCreateWithoutChatSessionsInput>
    where?: UserWhereInput
  }

  export type UserUpdateToOneWithWhereWithoutChatSessionsInput = {
    where?: UserWhereInput
    data: XOR<UserUpdateWithoutChatSessionsInput, UserUncheckedUpdateWithoutChatSessionsInput>
  }

  export type UserUpdateWithoutChatSessionsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUpdateManyWithoutUserNestedInput
    goals?: GoalUpdateManyWithoutUserNestedInput
  }

  export type UserUncheckedUpdateWithoutChatSessionsInput = {
    email?: StringFieldUpdateOperationsInput | string
    name?: NullableStringFieldUpdateOperationsInput | string | null
    avatarUrl?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    attributes?: UserAttributeUncheckedUpdateManyWithoutUserNestedInput
    dimensionInputs?: DimensionInputUncheckedUpdateManyWithoutUserNestedInput
    lifeStates?: LifeStateUncheckedUpdateManyWithoutUserNestedInput
    lifeEvents?: LifeEventUncheckedUpdateManyWithoutUserNestedInput
    goals?: GoalUncheckedUpdateManyWithoutUserNestedInput
  }

  export type ChatSessionCreateWithoutMessagesInput = {
    id?: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
    user: UserCreateNestedOneWithoutChatSessionsInput
  }

  export type ChatSessionUncheckedCreateWithoutMessagesInput = {
    id?: string
    userId: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ChatSessionCreateOrConnectWithoutMessagesInput = {
    where: ChatSessionWhereUniqueInput
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
  }

  export type ChatSessionUpsertWithoutMessagesInput = {
    update: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
    create: XOR<ChatSessionCreateWithoutMessagesInput, ChatSessionUncheckedCreateWithoutMessagesInput>
    where?: ChatSessionWhereInput
  }

  export type ChatSessionUpdateToOneWithWhereWithoutMessagesInput = {
    where?: ChatSessionWhereInput
    data: XOR<ChatSessionUpdateWithoutMessagesInput, ChatSessionUncheckedUpdateWithoutMessagesInput>
  }

  export type ChatSessionUpdateWithoutMessagesInput = {
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutChatSessionsNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutMessagesInput = {
    userId?: StringFieldUpdateOperationsInput | string
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAttributeCreateManyUserInput = {
    id?: string
    dimensionId: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type DimensionInputCreateManyUserInput = {
    id?: string
    dimensionId: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
  }

  export type LifeStateCreateManyUserInput = {
    id?: string
    lifeScore: number
    balanceScore: number
    alignmentScore: number
    energyIndex: number
    timestamp?: Date | string
    triggeredBy?: string | null
    insights?: InputJsonValue | null
    scores?: XOR<DimensionScoreListCreateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeEventCreateManyUserInput = {
    id?: string
    type: string
    title: string
    description?: string | null
    date: Date | string
    impact?: InputJsonValue | null
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type GoalCreateManyUserInput = {
    id?: string
    title: string
    description?: string | null
    dimensionId?: string | null
    progress?: number
    status?: string
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type ChatSessionCreateManyUserInput = {
    id?: string
    context: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type UserAttributeUpdateWithoutUserInput = {
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dimension?: DimensionUpdateOneRequiredWithoutAttributesNestedInput
  }

  export type UserAttributeUncheckedUpdateWithoutUserInput = {
    dimensionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAttributeUncheckedUpdateManyWithoutUserInput = {
    dimensionId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionInputUpdateWithoutUserInput = {
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dimension?: DimensionUpdateOneRequiredWithoutDimensionInputsNestedInput
  }

  export type DimensionInputUncheckedUpdateWithoutUserInput = {
    dimensionId?: StringFieldUpdateOperationsInput | string
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionInputUncheckedUpdateManyWithoutUserInput = {
    dimensionId?: StringFieldUpdateOperationsInput | string
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeStateUpdateWithoutUserInput = {
    lifeScore?: FloatFieldUpdateOperationsInput | number
    balanceScore?: FloatFieldUpdateOperationsInput | number
    alignmentScore?: FloatFieldUpdateOperationsInput | number
    energyIndex?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    insights?: InputJsonValue | InputJsonValue | null
    scores?: XOR<DimensionScoreListUpdateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateUncheckedUpdateWithoutUserInput = {
    lifeScore?: FloatFieldUpdateOperationsInput | number
    balanceScore?: FloatFieldUpdateOperationsInput | number
    alignmentScore?: FloatFieldUpdateOperationsInput | number
    energyIndex?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    insights?: InputJsonValue | InputJsonValue | null
    scores?: XOR<DimensionScoreListUpdateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeStateUncheckedUpdateManyWithoutUserInput = {
    lifeScore?: FloatFieldUpdateOperationsInput | number
    balanceScore?: FloatFieldUpdateOperationsInput | number
    alignmentScore?: FloatFieldUpdateOperationsInput | number
    energyIndex?: FloatFieldUpdateOperationsInput | number
    timestamp?: DateTimeFieldUpdateOperationsInput | Date | string
    triggeredBy?: NullableStringFieldUpdateOperationsInput | string | null
    insights?: InputJsonValue | InputJsonValue | null
    scores?: XOR<DimensionScoreListUpdateEnvelopeInput, DimensionScoreCreateInput> | DimensionScoreCreateInput[]
  }

  export type LifeEventUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: InputJsonValue | InputJsonValue | null
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventUncheckedUpdateWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: InputJsonValue | InputJsonValue | null
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type LifeEventUncheckedUpdateManyWithoutUserInput = {
    type?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    date?: DateTimeFieldUpdateOperationsInput | Date | string
    impact?: InputJsonValue | InputJsonValue | null
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type GoalUpdateWithoutUserInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actions?: GoalActionUpdateManyWithoutGoalNestedInput
  }

  export type GoalUncheckedUpdateWithoutUserInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    actions?: GoalActionUncheckedUpdateManyWithoutGoalNestedInput
  }

  export type GoalUncheckedUpdateManyWithoutUserInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    dimensionId?: NullableStringFieldUpdateOperationsInput | string | null
    progress?: FloatFieldUpdateOperationsInput | number
    status?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatSessionUpdateWithoutUserInput = {
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateWithoutUserInput = {
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    messages?: ChatMessageUncheckedUpdateManyWithoutSessionNestedInput
  }

  export type ChatSessionUncheckedUpdateManyWithoutUserInput = {
    context?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAttributeCreateManyDimensionInput = {
    id?: string
    userId: string
    name: string
    category: string
    metadata?: InputJsonValue | null
    createdAt?: Date | string
  }

  export type DimensionInputCreateManyDimensionInput = {
    id?: string
    userId: string
    inputType: string
    subType?: string | null
    valueJson: InputJsonValue
    source?: string
    createdAt?: Date | string
  }

  export type UserAttributeUpdateWithoutDimensionInput = {
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutAttributesNestedInput
  }

  export type UserAttributeUncheckedUpdateWithoutDimensionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type UserAttributeUncheckedUpdateManyWithoutDimensionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    name?: StringFieldUpdateOperationsInput | string
    category?: StringFieldUpdateOperationsInput | string
    metadata?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionInputUpdateWithoutDimensionInput = {
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    user?: UserUpdateOneRequiredWithoutDimensionInputsNestedInput
  }

  export type DimensionInputUncheckedUpdateWithoutDimensionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionInputUncheckedUpdateManyWithoutDimensionInput = {
    userId?: StringFieldUpdateOperationsInput | string
    inputType?: StringFieldUpdateOperationsInput | string
    subType?: NullableStringFieldUpdateOperationsInput | string | null
    valueJson?: InputJsonValue | InputJsonValue
    source?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type DimensionScoreUpdateInput = {
    dimensionId?: StringFieldUpdateOperationsInput | string
    score?: FloatFieldUpdateOperationsInput | number
    trend?: StringFieldUpdateOperationsInput | string
    confidence?: NullableFloatFieldUpdateOperationsInput | number | null
  }

  export type GoalActionCreateManyGoalInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    targetDate?: Date | string | null
    dimensions?: GoalActionCreatedimensionsInput | string[]
    attributes?: GoalActionCreateattributesInput | string[]
    impact?: InputJsonValue | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type GoalActionUpdateWithoutGoalInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tasks?: TaskUpdateManyWithoutGoalActionNestedInput
  }

  export type GoalActionUncheckedUpdateWithoutGoalInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    tasks?: TaskUncheckedUpdateManyWithoutGoalActionNestedInput
  }

  export type GoalActionUncheckedUpdateManyWithoutGoalInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    targetDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    dimensions?: GoalActionUpdatedimensionsInput | string[]
    attributes?: GoalActionUpdateattributesInput | string[]
    impact?: InputJsonValue | InputJsonValue | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskCreateManyGoalActionInput = {
    id?: string
    title: string
    description?: string | null
    isCompleted?: boolean
    startDate?: Date | string | null
    endDate?: Date | string | null
    estimatedHours?: number | null
    createdAt?: Date | string
    updatedAt?: Date | string | null
  }

  export type TaskUpdateWithoutGoalActionInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedHours?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUncheckedUpdateWithoutGoalActionInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedHours?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type TaskUncheckedUpdateManyWithoutGoalActionInput = {
    title?: StringFieldUpdateOperationsInput | string
    description?: NullableStringFieldUpdateOperationsInput | string | null
    isCompleted?: BoolFieldUpdateOperationsInput | boolean
    startDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    endDate?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    estimatedHours?: NullableFloatFieldUpdateOperationsInput | number | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
  }

  export type ChatMessageCreateManySessionInput = {
    id?: string
    role: string
    content: string
    createdAt?: Date | string
  }

  export type ChatMessageUpdateWithoutSessionInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateWithoutSessionInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ChatMessageUncheckedUpdateManyWithoutSessionInput = {
    role?: StringFieldUpdateOperationsInput | string
    content?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Aliases for legacy arg types
   */
    /**
     * @deprecated Use UserCountOutputTypeDefaultArgs instead
     */
    export type UserCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DimensionCountOutputTypeDefaultArgs instead
     */
    export type DimensionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DimensionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoalCountOutputTypeDefaultArgs instead
     */
    export type GoalCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoalCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoalActionCountOutputTypeDefaultArgs instead
     */
    export type GoalActionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoalActionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatSessionCountOutputTypeDefaultArgs instead
     */
    export type ChatSessionCountOutputTypeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatSessionCountOutputTypeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DimensionScoreDefaultArgs instead
     */
    export type DimensionScoreArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DimensionScoreDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserDefaultArgs instead
     */
    export type UserArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DimensionDefaultArgs instead
     */
    export type DimensionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DimensionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use UserAttributeDefaultArgs instead
     */
    export type UserAttributeArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = UserAttributeDefaultArgs<ExtArgs>
    /**
     * @deprecated Use DimensionInputDefaultArgs instead
     */
    export type DimensionInputArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = DimensionInputDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LifeStateDefaultArgs instead
     */
    export type LifeStateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LifeStateDefaultArgs<ExtArgs>
    /**
     * @deprecated Use LifeEventDefaultArgs instead
     */
    export type LifeEventArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = LifeEventDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoalDefaultArgs instead
     */
    export type GoalArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoalDefaultArgs<ExtArgs>
    /**
     * @deprecated Use GoalActionDefaultArgs instead
     */
    export type GoalActionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = GoalActionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use TaskDefaultArgs instead
     */
    export type TaskArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = TaskDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatSessionDefaultArgs instead
     */
    export type ChatSessionArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatSessionDefaultArgs<ExtArgs>
    /**
     * @deprecated Use ChatMessageDefaultArgs instead
     */
    export type ChatMessageArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = ChatMessageDefaultArgs<ExtArgs>

  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}