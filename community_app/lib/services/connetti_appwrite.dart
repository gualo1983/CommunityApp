import 'package:appwrite/appwrite.dart';

Client client = Client()
    .setEndpoint('https://cloud.appwrite.io/v1') // Your API Endpoint
    .setProject('647b8b0ac0c9c790ead7'); // Your project ID
Account account = Account(client);
