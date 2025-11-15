import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#fff1f2', // rose-50
  },
  listContent: {
    padding: 16,
    paddingBottom: 100,
  },
  // Card
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  cardTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#9d174d', // rose-700
  },
  statusChip: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  statusChipText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteIcon: {
    padding: 6,
    alignSelf: 'flex-start',
  },
  textBase: {
    fontSize: 16,
    color: '#9f1239', // rose-700-ish
    marginBottom: 4,
  },
  textSecondary: {
    fontSize: 14,
    color: '#be185d', // pink-700
    marginBottom: 4,
  },
  mb12: {
    marginBottom: 12,
  },
  actionsRow: {
    flexDirection: 'row',
  },
  actionButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '600',
  },
  bgRed: { backgroundColor: '#f472b6' }, // pink-400
  bgBlue: { backgroundColor: '#ec4899' }, // pink-500
  bgGreen: { backgroundColor: '#db2777' }, // pink-600
  ml8: { marginLeft: 8 },

  // Bulk actions bar
  bulkActions: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.08,
        shadowRadius: 2,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  bulkButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  bulkButtonText: {
    color: '#ffffff',
    fontWeight: '600',
  },

  // FAB
  fab: {
    position: 'absolute',
    right: 25,
    bottom: 56,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ec4899', // pink-500
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  fabText: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '300',
    lineHeight: 30,
  },
  listEmptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 96,
  },
  listEmptyTitle: {
    fontSize: 18,
    color: '#f472b6', // pink-400
    marginBottom: 8,
  },
  listEmptySubtitle: {
    fontSize: 14,
    color: '#f9a8d4', // pink-300
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  madeWithLove: {
    fontSize: 14,
    color: '#9f1239', // rose-700-ish
    textAlign: 'center',
    marginTop: 16,
  },
});

export default styles;


