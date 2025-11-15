import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff1f2', // rose-50
  },
  container: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#9d174d', // rose-700
  },
  input: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f9a8d4', // pink-300
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#ec4899', // pink-500
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 6,
  },
  saveButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default styles;


