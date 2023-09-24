export class AppConfig {
  private static _instance: AppConfig | null = null;

  private constructor() {}

  public static get instance(): AppConfig {
    if (!AppConfig._instance) AppConfig._instance = new AppConfig();
    return AppConfig._instance;
  }

  public get<Type>(key: string): Type | undefined {
    return process.env[key] as Type | undefined;
  }
}
