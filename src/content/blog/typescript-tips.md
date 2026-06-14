---
title: "TypeScript 官方文档精华总结：从入门到实用的完整指南"
description: "基于 TypeScript 官方文档，用通俗易懂的方式梳理核心概念，帮你快速掌握类型系统的精髓。"
pubDate: 2026-06-13T18:30:00+08:00
tags: ["TypeScript", "前端", "教程", "官方文档"]
---

## 为什么需要 TypeScript

JavaScript 是动态类型语言——变量可以随时存放任何类型的值。这在小项目中很方便，但当项目变大，"类型不匹配"这类 bug 会越来越难排查。

TypeScript 在 JavaScript 的基础上加了一层**类型系统**，让你在写代码时就能发现错误，而不是等到运行时。

```typescript
// JavaScript：运行时才会报错
function add(a, b) { return a + b; }
add("1", 2); // "12" —— 你可能不想要这个结果

// TypeScript：写代码时就报错
function add(a: number, b: number) { return a + b; }
add("1", 2); // 报错：string 不能赋值给 number
```

## 基础类型

TypeScript 为 JavaScript 的每种值都提供了对应的类型：

```typescript
// 原始类型
let name: string = "Vingues";
let age: number = 25;
let active: boolean = true;

// 数组
let tags: string[] = ["前端", "TypeScript"];
let scores: Array<number> = [90, 85, 92];

// 特殊类型
let nothing: null = null;
let notDefined: undefined = undefined;
let anything: any = "可以是任何值"; // 尽量少用，等于放弃类型检查
let something: unknown = "比 any 安全"; // 必须先判断类型才能使用
```

**`any` vs `unknown`**：两者都能接收任意值，但 `unknown` 更安全——你必须先检查类型才能操作它，而 `any` 可以直接使用，绕过了所有类型检查。

## 接口与类型别名

当你需要描述一个对象的结构时，有两种方式：

```typescript
// 接口（interface）—— 推荐用于定义对象形状
interface User {
  id: number;
  name: string;
  email: string;
  age?: number; // 可选属性
}

// 类型别名（type）—— 更灵活，可以定义联合类型、元组等
type Status = "active" | "inactive" | "pending";
type Point = [number, number];
```

**什么时候用哪个？** 简单来说：定义对象结构用 `interface`，需要联合类型或更复杂的组合用 `type`。两者在大多数场景下可以互换。

## 函数类型

TypeScript 可以精确描述函数的参数和返回值：

```typescript
// 参数和返回值类型
function greet(name: string): string {
  return `你好，${name}`;
}

// 箭头函数
const double = (n: number): number => n * 2;

// 可选参数和默认值
function createUser(name: string, role: string = "user") {
  return { name, role };
}

// 剩余参数
function sum(...numbers: number[]): number {
  return numbers.reduce((a, b) => a + b, 0);
}
```

## 联合类型与交叉类型

这是组合类型的两种基本方式：

```typescript
// 联合类型（|）—— 值可以是 A 或 B
type ID = string | number;
let userId: ID = "abc123";
userId = 42; // 也可以

// 交叉类型（&）—— 同时拥有 A 和 B 的所有属性
interface HasName { name: string }
interface HasAge { age: number }
type Person = HasName & HasAge;
// 等价于 { name: string; age: number }
```

## 类型收窄

TypeScript 能根据你的代码逻辑自动推断更精确的类型：

```typescript
function process(value: string | number) {
  // typeof 收窄
  if (typeof value === "string") {
    return value.toUpperCase(); // 这里 TypeScript 知道 value 是 string
  }
  return value.toFixed(2); // 这里 TypeScript 知道 value 是 number
}

// in 操作符收窄
interface Dog { bark(): void }
interface Cat { meow(): void }
function speak(animal: Dog | Cat) {
  if ("bark" in animal) {
    animal.bark(); // 这里是 Dog
  } else {
    animal.meow(); // 这里是 Cat
  }
}
```

## 枚举

枚举用于定义一组命名常量：

```typescript
// 数字枚举（默认从 0 开始）
enum Direction {
  Up,      // 0
  Down,    // 1
  Left,    // 2
  Right,   // 3
}

// 字符串枚举（更直观）
enum Status {
  Active = "ACTIVE",
  Inactive = "INACTIVE",
  Pending = "PENDING",
}

// 常量枚举（编译后会被内联，更高效）
const enum Color {
  Red = "RED",
  Green = "GREEN",
  Blue = "BLUE",
}
```

## 泛型

泛型是 TypeScript 最强大的特性之一——它让你写出"类型参数化"的代码，就像函数接收值一样，类型也可以被"传参"：

```typescript
// 泛型函数
function identity<T>(value: T): T {
  return value;
}
identity<string>("hello"); // 显式指定
identity(42); // 自动推断为 number

// 泛型接口
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}
type UserResponse = ApiResponse<User>;
type ListResponse = ApiResponse<User[]>;

// 泛型约束
function getLength<T extends { length: number }>(value: T): number {
  return value.length;
}
getLength("hello");  // 5
getLength([1, 2, 3]); // 3
```

## 内置工具类型

TypeScript 内置了许多实用的工具类型，避免你重复造轮子：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// Partial<T> —— 所有属性变为可选
type UpdateUser = Partial<User>;
// { id?: number; name?: string; email?: string }

// Required<T> —— 所有属性变为必需
type StrictUser = Required<User>;

// Pick<T, K> —— 只保留指定属性
type UserBasic = Pick<User, "id" | "name">;
// { id: number; name: string }

// Omit<T, K> —— 排除指定属性
type UserWithoutEmail = Omit<User, "email">;
// { id: number; name: string }

// Record<K, V> —— 构造键值对类型
type UserMap = Record<string, User>;
// { [key: string]: User }

// Readonly<T> —— 所有属性变为只读
type FrozenUser = Readonly<User>;
```

## 条件类型

条件类型让你根据类型关系来选择不同的类型，语法类似三元表达式：

```typescript
type IsString<T> = T extends string ? "yes" : "no";

type A = IsString<"hello">; // "yes"
type B = IsString<42>;      // "no"

// 实际用途：根据输入类型返回不同结果
type Flatten<T> = T extends Array<infer U> ? U : T;
type X = Flatten<number[]>; // number
type Y = Flatten<string>;   // string
```

`infer` 关键字用于在条件类型中"捕获"某个位置的类型，就像正则表达式的捕获组一样。

## 类型守卫

类型守卫是自定义的检查函数，帮助 TypeScript 在运行时收窄类型：

```typescript
interface Cat { meow(): void; kind: "cat" }
interface Dog { bark(): void; kind: "dog" }

// 自定义类型守卫
function isCat(animal: Cat | Dog): animal is Cat {
  return animal.kind === "cat";
}

function handle(animal: Cat | Dog) {
  if (isCat(animal)) {
    animal.meow();  // TypeScript 知道这里是 Cat
  } else {
    animal.bark();  // TypeScript 知道这里是 Dog
  }
}
```

`animal is Cat` 是返回值类型注解，告诉 TypeScript：如果这个函数返回 `true`，那么参数就是 `Cat` 类型。

## keyof 类型操作符

`keyof` 用于获取一个类型的所有键名，返回联合类型：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

type UserKeys = keyof User;
// 等价于 "id" | "name" | "email"

// 实际用途：创建类型安全的属性访问函数
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user: User = { id: 1, name: "Vingues", email: "test@example.com" };
getProperty(user, "name"); // 正确
getProperty(user, "age");  // 报错："age" 不是 User 的键
```

## typeof 类型操作符

`typeof` 用于获取一个变量的类型：

```typescript
const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
  retries: 3,
};

// 获取 config 的类型
type Config = typeof config;
// { apiUrl: string; timeout: number; retries: number }

// 实际用途：创建与变量类型匹配的函数参数
function createRequest(config: Config) {
  // ...
}
```

## 索引访问类型

使用方括号语法访问类型的某个属性类型：

```typescript
interface User {
  id: number;
  name: string;
  address: {
    city: string;
    zipCode: string;
  };
}

type UserName = User["name"]; // string
type UserAddress = User["address"]; // { city: string; zipCode: string }
type City = User["address"]["city"]; // string

// 实际用途：从数组类型中提取元素类型
type Colors = ["red", "green", "blue"];
type FirstColor = Colors[0]; // "red"
type AnyColor = Colors[number]; // "red" | "green" | "blue"
```

## 映射类型

映射类型基于已有类型创建新类型，通过遍历键来修改属性：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

// 所有属性变为可选
type OptionalUser = {
  [K in keyof User]?: User[K];
};
// 等价于 Partial<User>

// 所有属性变为只读
type ReadonlyUser = {
  readonly [K in keyof User]: User[K];
};
// 等价于 Readonly<User>

// 所有属性变为可写
type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};

// 所有属性变为必需
type RequiredUser = {
  [K in keyof User]-?: User[K];
};
// 等价于 Required<User>
```

## 模板字面量类型

TypeScript 支持在类型中使用模板字符串语法：

```typescript
type EventName = "click" | "focus" | "blur";
type HandlerName = `on${Capitalize<EventName>}`;
// "onClick" | "onFocus" | "onBlur"

// 实际用途：创建类型安全的事件处理器
type EventHandler = `handle${Capitalize<EventName>}`;

// 结合联合类型
type CSSProperty = "margin" | "padding";
type CSSDirection = "top" | "right" | "bottom" | "left";
type CSSValue = `${CSSProperty}-${CSSDirection}`;
// "margin-top" | "margin-right" | ... | "padding-left"
```

## 内置工具类型进阶

除了前面提到的基础工具类型，TypeScript 还提供了更多实用类型：

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
}

// Exclude<T, U> —— 从联合类型中排除某些类型
type NonString = Exclude<string | number | boolean, string>;
// number | boolean

// Extract<T, U> —— 从联合类型中提取某些类型
type StringOnly = Extract<string | number | boolean, string>;
// string

// NonNullable<T> —— 从联合类型中排除 null 和 undefined
type SafeString = NonNullable<string | null | undefined>;
// string

// ReturnType<T> —— 获取函数返回值类型
function greet(name: string) { return `Hello, ${name}`; }
type GreetReturn = ReturnType<typeof greet>; // string

// Parameters<T> —— 获取函数参数类型
type GreetParams = Parameters<typeof greet>; // [name: string]

// Awaited<T> —— 获取 Promise 的解析类型
type UserPromise = Promise<User>;
type UserData = Awaited<UserPromise>; // User
```

## 模块与声明文件

TypeScript 的模块系统和 JavaScript 一致，但增加了类型信息：

```typescript
// math.ts —— 导出
export function add(a: number, b: number): number {
  return a + b;
}

// app.ts —— 导入
import { add } from "./math";
```

当你使用没有类型的第三方库时，需要安装对应的 `@types/xxx` 声明文件：

```bash
npm install @types/lodash
```

如果没有现成的声明文件，可以创建一个 `.d.ts` 文件手动声明：

```typescript
// types/my-lib.d.ts
declare module "my-lib" {
  export function doSomething(input: string): number;
}
```

## tsconfig.json 核心配置

每个 TypeScript 项目都有一个 `tsconfig.json`，它控制编译行为：

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "outDir": "./dist",
    "declaration": true
  }
}
```

几个重要配置：

- **`strict: true`** — 开启所有严格检查，建议始终开启
- **`target`** — 编译目标版本，决定了哪些 JS 语法会被降级
- **`module`** — 模块系统，现代项目一般用 `ESNext`
- **`noUncheckedIndexedAccess`** — 数组索引访问可能返回 `undefined`，开启后更安全

## 类型推断最佳实践

TypeScript 的类型推断非常强大，掌握它可以让你的代码更简洁：

```typescript
// 1. 让 TypeScript 自动推断
const user = {
  id: 1,
  name: "Vingues",
  email: "test@example.com",
}; // 自动推断为 { id: number; name: string; email: string }

// 2. 使用 const 断言
const routes = ["/home", "/about", "/contact"] as const;
// 类型为 readonly ["/home", "/about", "/contact"]
// 而不是 string[]

// 3. 使用 satisfies 操作符（TypeScript 4.9+）
type Config = {
  apiUrl: string;
  timeout: number;
};

const config = {
  apiUrl: "https://api.example.com",
  timeout: 5000,
} satisfies Config;
// config 保持推断的类型，同时满足 Config 约束

// 4. 使用 satisfies 验证对象字面量
const colors = {
  red: "#ff0000",
  green: "#00ff00",
  blue: "#0000ff",
} satisfies Record<string, string>;
```

## 常见陷阱与解决方案

### 1. 数组索引访问

```typescript
const arr = ["a", "b", "c"];

// 问题：arr[10] 返回 string，但实际是 undefined
const value = arr[10]; // string（可能有问题）

// 解决方案 1：开启 noUncheckedIndexedAccess
// 在 tsconfig.json 中设置 "noUncheckedIndexedAccess": true
// 这样 arr[10] 会返回 string | undefined

// 解决方案 2：使用 at() 方法
const value2 = arr.at(10); // string | undefined
```

### 2. 对象属性访问

```typescript
interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: "Vingues", email: "test@example.com" };

// 问题：user["age"] 会报错，但 user.age 也会报错
// 解决方案：使用可选链和空值合并
const userName = user?.name ?? "Unknown";
```

### 3. 函数参数类型

```typescript
// 问题：回调函数参数类型可能不明确
function fetchData(callback: (data: any) => void) {
  // callback 参数是 any，不够安全
}

// 解决方案：使用泛型
function fetchData<T>(callback: (data: T) => void) {
  // callback 参数类型明确
}
```

## 实际应用场景

### 1. API 响应类型

```typescript
interface ApiResponse<T> {
  code: number;
  message: string;
  data: T;
}

interface User {
  id: number;
  name: string;
  email: string;
}

// 使用
type UserResponse = ApiResponse<User>;
type UserListResponse = ApiResponse<User[]>;

async function getUser(id: number): Promise<UserResponse> {
  const response = await fetch(`/api/users/${id}`);
  return response.json();
}
```

### 2. 表单验证类型

```typescript
interface FormData {
  username: string;
  password: string;
  email: string;
  age: number;
}

// 验证结果类型
type ValidationErrors = Partial<Record<keyof FormData, string>>;

function validate(data: FormData): ValidationErrors {
  const errors: ValidationErrors = {};

  if (data.username.length < 3) {
    errors.username = "用户名至少3个字符";
  }

  if (data.password.length < 8) {
    errors.password = "密码至少8个字符";
  }

  return errors;
}
```

### 3. 状态管理类型

```typescript
// 状态类型
type State = {
  count: number;
  name: string;
  items: string[];
};

// Action 类型（使用区分联合类型）
type Action =
  | { type: "INCREMENT"; payload: number }
  | { type: "DECREMENT"; payload: number }
  | { type: "SET_NAME"; payload: string }
  | { type: "ADD_ITEM"; payload: string }
  | { type: "REMOVE_ITEM"; payload: number };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + action.payload };
    case "DECREMENT":
      return { ...state, count: state.count - action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "ADD_ITEM":
      return { ...state, items: [...state.items, action.payload] };
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter((_, index) => index !== action.payload),
      };
  }
}
```

## 写在最后

TypeScript 的类型系统是图灵完备的——理论上你可以用它做任何计算。但日常开发中，**够用就好**。不需要为了炫技写复杂的类型体操，清晰、易维护才是最重要的。

建议从 `strict: true` 开始，遇到报错时查阅文档，逐步积累对类型系统的理解。用得多了，自然就熟了。
