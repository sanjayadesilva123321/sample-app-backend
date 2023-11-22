import {NestFactory} from "@nestjs/core";
import {ConfigService} from "@nestjs/config";
import {SwaggerModule, DocumentBuilder} from "@nestjs/swagger";
import {AppModule} from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const configService = app.get<ConfigService>(ConfigService);

    app.enableCors({
        origin: configService.get("CORS_ORIGIN"),
        methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
        preflightContinue: false,
        optionsSuccessStatus: 204,
        exposedHeaders: "*",
    });

    /*
    swagger
    */
    const config = new DocumentBuilder()
        .setTitle("Your API")
        .setDescription("API description")
        .setVersion("1.0")
        .addBearerAuth(
            {
                description: "Access Token",
                name: "Authorization",
                bearerFormat: "Bearer",
                scheme: "Bearer",
                type: "http",
                in: "Header",
            },
            "access-token"
        )
        .addTag("API")
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api/swagger", app, document);

    await app.listen(3000);
    console.log("Sample app started at port : " + configService.get("PORT"));
}
bootstrap();
