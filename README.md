# GEOMATIC TECHNICAL ASSESSMENT



  ## Table of content
1. [Project Overview](#ProjectOverview)
2. [Tasks](#Tasks)
   - [1. Tools and Approach ](#2-tools-approach)
   - [2. Set Up](#2-set-up)
   - [3. Achitecture and Demonstration](#3-technical-archittecture)

---
## Project Overview
Hello, My name is Hamza Bouras Welcome to my assessment application! This Repository shows the solution I made of a web application that leverages the ArcGIS API
to enable users to interact with geographical data,perform spatial analyses, and visualize
insights through maps and synchronized charts.

![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/7f504cf4-53bd-4465-b7bb-7859e5e03d6d)

## Tasks
### Tools and Approach
- Backend: Spring Boot with PostgreSQL and PostGIS
   - Spring Boot: Utilizes the Spring framework for rapid development of Java-based applications, providing features like dependency injection, MVC architecture, and easy configuration.
   - PostgreSQL: A powerful open-source relational database management system known for its extensibility and support for spatial data through PostGIS.
   - PostGIS: An extension to PostgreSQL that adds support for geographic objects, allowing storage, indexing, and querying of geographic data.
- Frontend: Angular Framework with ArcGIS API
   - Angular :is a robust frontend framework maintained by Google, ideal for building dynamic and interactive single-page applications (SPAs).
   - ArcGIS API: Angular integrates smoothly with the ArcGIS API for JavaScript, allowing you to embed maps, perform spatial queries, and visualize geospatial data effortlessly.
   - Angular Mterial:  Angular Material provides a set of reusable and customizable UI components following the Material Design guidelines.
   - Canvas: Utilizing Canvas in Angular allows you to create custom charts and graphs for visualizing transportation data fetched from the backend.
- Approach:
 In my approach, I Designed RESTful APIs in Spring Boot to expose endpoints for CRUD operations to handle point coordinates and polygons, utilizing PostGIS extension functionalities for spatial queries of stations in the database. Additionally, I developed other endpoints for search, listing, and various operations. Using ArcGIS with Angular, I built the frontend to interact with the API, enabling users to visualize and manipulate geographic data seamlessly.
- Data Loading: I converted csv transportation data into geojson and  loaded it into PostgreSQL using python scripts.
     ![convert-csv-into-geojson](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/7ba32e5f-884f-4f03-a13b-1f10f122ddd7)
     ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/55139ad6-4d11-4a2c-b9fb-baa732eb9ea0)
- Dependencies :
  
| Spring Boot Dependency  | Description |
| ------------- | ------------- |
| spring-boot-starter-data-jpa  | This dependency provides a simple way to integrate JPA (Java Persistence API) with a Spring Boot application, facilitating data access and management.  |
| spring-boot-starter-validation  | Provides support for bean validation in Spring Boot applications using Hibernate Validator.  |
|spring-boot-starter-web|Provides the necessary components to build web applications, including RESTful services.| 
|spring-boot-devtools|Provides development-time tools and features to enhance productivity and streamline development workflows in Spring Boot applications.|
|hibernate-spatial|Provides spatial and geometric extensions for Hibernate, enabling the mapping of spatial database types (such as points, lines, polygons) to Java objects.|
|slf4j-api|Java library that provides a unified logging interface for various logging frameworks.|
|springdoc-openapi-starter-webmvc-ui|Library for Spring Boot applications that integrates Swagger UI (OpenAPI UI) with Spring Web MVC. |
|jts-io-common|facilitates reading and writing operations for geospatial data in various formats using the Java Topology Suite (JTS).|
|postgis-jdbc|Library is a Java library that provides JDBC (Java Database Connectivity) support for PostgreSQL databases extended with PostGIS. |
|lombok|Java library that helps reduce boilerplate code in Java classes.|

| Angular Dependency  | Description |
| ------------- | ------------- |
| @angular/material  | Comprehensive library that provides a set of reusable UI components and styles for building modern web applications with Angular.   |
| @arcgis/core  | modular JavaScript library for building web mapping applications using the ArcGIS platform.  |
| esri-loader  |  lightweight utility for dynamically loading the ArcGIS API for JavaScript (version 4.x) into web applications.  |
|@canvasjs/angular-charts| Library that provides Angular components for integrating CanvasJS charts into Angular applications. | 



### Set Up and Installation instructions
To set up this project and run it follow these steps:
- Frontend:
  > Requirement: Ensure you have node js package manager such as npm, yarn...
1. clone the github monorepo into you machine:
   ```
    git clone https://github.com/hamzabourass/Geomatic_Technical_Assessment.git
   ```
2. Navigate to the frontend app and run :
   ```
   // If you have Angular CLI
   ng serve  
   ```
   Or 

   ```
   // Using a package manager
   npm start  
   ```
- Backend:
  > Requirements: Ensure you have PosgreSQL with PostGIS installed
1. Inside the monorepo there is the spring boot app ``backend``
2. If you have pgAdmin open it and Create a PostgreSQL database name geo_db with username ``admin`` and password ``admin-root`` (if you choose diffrent password and username dont forget to modify them on ``application.properties`` in backend folder) otherwise use ``psql shell`` to create the db with this command:
   ```
    CREATE DATABASE geo_db;

   ```
3. Enable PostGIS extension:
   ```
    CREATE EXTENSION postgis;
   ```
4. Run the spring boot app to intiliaze the database with your ide of choice
5. After that you will have to run the script in ``/scripts`` folder in the monorepo to load the transport_stations.geojson in ``geo_data`` folder into you database.
   > Python is required to be installed
   >> Insure both script and data are in the same path then run:

   ```
    python loadStations.py
   ```
6. The you are good to go!!

### Architecture and Demonstration:
This is the global architeture of the project
![diagram-export-25-06-2024-01_49_59](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/dd9ca842-e938-464e-b519-b3f3bd32efde)

Spring Boot Package structure: 
```
BackendApplication
├── config
│   └── JdbcTemplateConfig
│
├── dtos
│   ├── PointDTO
│   |── PolygonDTO  
|    ──  TransportStationDTO
│
├── entities
│   ├── TransportStation.java
│   ├── Point.java
│   └── ...
│
├── geometry
│   ├── GeometryType.java
│   |── PointDeserializer.java
|   └── PointSerializer
│
├── repository
│   ├── TransportStationRepository.java
│   ├── PointRepository.java
│   └── ...
│
├── service
│   ├── TransportStationService.java
│   └── ...
│
└── web
    ├── controllers
    │   ├── TransportStationController.java
   
    


````
### Demonstration (Result on chart might be duplicated because I uploaded the file again into my db for testing)
Backend endpoints in swagger UI:
![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/b5251711-f5ad-47ae-b0e1-365ee385ea1a)

Frontend:
- What is done:
  
    - [x] Display a map with the ability to choose different basemaps
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/ef783a43-1609-468c-bb76-1bd0272c9687)

    - [x] Provide tools for creating, modifying, and deleting geometries
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/6d385502-7afa-4f66-ada4-b2a87e9977bc)

    - [x] Include tools for selecting objects on the map, displaying a pop-up window with the object's attributes
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/25b50db3-22be-4d61-b1ff-f7a095cba6b6)

    - [x] Allow users to modify both the geometry and attributes of existing objects.
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/d019b62b-ae59-49a8-a1cc-c73337c58803)

    - [x] Allow users to view layers they have created, displaying the name of the object type and the color of the symbol.
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/3e8a6628-2d0a-48cc-8287-d5744f1ce744)

    - [x] Create a bar chart for filters (except filter by polygon)
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/dba27c78-8465-4c6d-92ef-c1542398067d)

    - [x] Filter by Region or Province
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/46a7abbc-54a3-498d-85fa-dd0cdef0041d)
![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/6688790f-b158-48c8-91ae-a464d61d877f)

    - [x] Search by Proximity
       - By selecting point from editor:
         ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/3a8e262b-cc41-4b83-a8bc-1a9b4a8fc8f1)
       - By using a dialog specifying coordinates:
       Input:
       ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/7908e1dd-941b-4afa-a36c-4bbb62049d83)
       Result:
      ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/4d71f5a9-7af4-4b82-ad8c-054db80035e2)

    - [x] Display Features in a User-Defined Area
     ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/c3926540-b5fc-4f99-ae09-4cc940fb06fd)

    - [x] Show Data Attributes
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/ad45a7a8-928c-4108-9142-230707deb8f8)
 
    - [x] Search station by key word
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/b5cbad3e-be84-41d5-b059-091ca32c0f20)
    - [x] Loading stations by type:
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/9fba7116-92d3-4848-9524-bd43b81758c2)
    - [x] Adding region and province geojson file into the map:
  ![image](https://github.com/hamzabourass/Geomatic_Technical_Assessment/assets/105117343/d9beea78-adfb-4f2b-b2e7-f0c6e2b65d73)


### Conclusion
Thank you for reviewing this assessment. I appreciate the opportunity to demonstrate my skills and passion for developing with Spring Boot, Angular, and ArcGIS API. I look forward to any feedback and further discussion.

  

