import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { trpc } from '@/lib/trpc';
import { Stack } from 'expo-router';
import { CheckCircle, XCircle, Database } from 'lucide-react-native';

export default function TestConnection() {
  const { data, isLoading, error, refetch } = trpc.test.connection.useQuery();

  return (
    <>
      <Stack.Screen options={{ title: 'Test de Connexion DB' }} />
      <View style={styles.container}>
        <View style={styles.header}>
          <Database size={64} color="#4F46E5" />
          <Text style={styles.title}>Test de Connexion</Text>
          <Text style={styles.subtitle}>Base de données Supabase PostgreSQL</Text>
        </View>

        {isLoading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#4F46E5" />
            <Text style={styles.loadingText}>Connexion en cours...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <XCircle size={48} color="#EF4444" />
            <Text style={styles.errorTitle}>Erreur de connexion</Text>
            <Text style={styles.errorText}>{error.message}</Text>
          </View>
        )}

        {data && data.success && data.tables && (
          <View style={styles.successContainer}>
            <CheckCircle size={48} color="#10B981" />
            <Text style={styles.successTitle}>Connexion réussie !</Text>
            
            <View style={styles.statsContainer}>
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{data.tables.users}</Text>
                <Text style={styles.statLabel}>Utilisateurs</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{data.tables.businesses}</Text>
                <Text style={styles.statLabel}>Entreprises</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{data.tables.surveys}</Text>
                <Text style={styles.statLabel}>Sondages</Text>
              </View>
              
              <View style={styles.statCard}>
                <Text style={styles.statValue}>{data.tables.admins}</Text>
                <Text style={styles.statLabel}>Admins</Text>
              </View>
            </View>
          </View>
        )}

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => refetch()}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Test en cours...' : 'Retester la connexion'}
          </Text>
        </TouchableOpacity>

        <View style={styles.infoContainer}>
          <Text style={styles.infoTitle}>Configuration</Text>
          <Text style={styles.infoText}>• Base de données: Supabase PostgreSQL</Text>
          <Text style={styles.infoText}>• ORM: Drizzle ORM</Text>
          <Text style={styles.infoText}>• API: tRPC</Text>
          <Text style={styles.infoText}>• Tables: 12 tables synchronisées</Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#111827',
    marginTop: 16,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6B7280',
  },
  errorContainer: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#FEF2F2',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#DC2626',
    marginTop: 16,
  },
  errorText: {
    fontSize: 14,
    color: '#991B1B',
    marginTop: 8,
    textAlign: 'center',
  },
  successContainer: {
    alignItems: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#059669',
    marginTop: 16,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 16,
  },
  statCard: {
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 20,
    minWidth: 140,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 32,
    fontWeight: '700',
    color: '#4F46E5',
  },
  statLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoContainer: {
    marginTop: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 4,
  },
});
