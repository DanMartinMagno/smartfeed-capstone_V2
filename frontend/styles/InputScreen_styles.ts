// InputScreen_styles.tsx

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: '#EDFBEB',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  container: {
    flex: 1,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  card: {
    marginBottom: 20,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    backgroundColor: '#F5FFF4',
    borderRadius: 90,
  },
  subHeader: {
    fontSize: 18,
    marginBottom: 10,
  },
  ingredientCard: {
    backgroundColor: '#fff',
    padding: 6,
    marginVertical: 7,
    marginHorizontal: 7,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  error: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  button: {
    padding: 3,
    marginTop: 20,
    borderRadius: 10,
  },
});





