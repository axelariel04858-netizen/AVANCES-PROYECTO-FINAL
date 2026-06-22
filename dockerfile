FROM eclipse-temurin:17-jdk-jammy
COPY . .

RUN chmod +x mvnw
RUN ./mvnw clean install -DskipTests
EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java -jar target/*.jar"]