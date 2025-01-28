import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:appwrite/appwrite.dart';
import 'package:riverpod_annotation/riverpod_annotation.dart';

final appwriteClientProvider = Provider<Client>((ref) {
  final client = Client();
  client
      .setEndpoint('https://cloud.appwrite.io/v1')
      .setProject('647b8b0ac0c9c790ead7');
  return client;
});

final appwriteAccountProvider = Provider<Account>((ref) {
  final client = ref.watch(appwriteClientProvider);
  return Account(client);
});
