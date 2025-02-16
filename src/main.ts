import { Logger, ValidationPipe, VersioningType, VERSION_NEUTRAL } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { AppModule } from "@src/app.module";
import helmet from "@fastify/helmet";
import { writeFileSync } from "fs";
import { PairDto } from "./dto/pair.dto";

async function bootstrap()
{
    const fastifyAdapter: FastifyAdapter = new FastifyAdapter({
        logger: false,
        ignoreTrailingSlash: true,
        disableRequestLogging: true,
    });

    // don't throw when Content-Type is different from 'application/json' and 'text/plain'
    // https://www.fastify.io/docs/latest/Reference/ContentTypeParser/#catch-all
    // eslint-disable-next-line
    fastifyAdapter.getInstance().addContentTypeParser("*", (request, payload, done) => done(null));

    const app: NestFastifyApplication = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        fastifyAdapter,
        { cors: true },
    );
    const logger: Logger = new Logger("NestApplication", { timestamp: true });
    const configService: ConfigService = app.get(ConfigService);
    const PORT: string =  <string>configService.get<string>("port");

    app.enableVersioning({
        type: VersioningType.URI,
        defaultVersion: VERSION_NEUTRAL,
    });

    const config: Omit<OpenAPIObject, "paths"> = new DocumentBuilder()
        .setTitle("Reservoir Finance API")
        .setVersion(<string>process.env.npm_package_version)
        .build();
    const document: OpenAPIObject = SwaggerModule.createDocument(app, config, {
        extraModels: [PairDto],
    });
    writeFileSync("./swagger-spec.json", JSON.stringify(document));
    SwaggerModule.setup("/", app, document);

    app.enableShutdownHooks();
    await app.register(helmet, {
        contentSecurityPolicy: false,
    });
    app.useGlobalPipes(new ValidationPipe());
    await app.listen(PORT, "0.0.0.0");
    logger.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
