import { StyleSheet } from 'react-native';

const ITEM_SIZE = 36;

const styles = StyleSheet.create({
  container: {
    gap: 12,
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    borderColor: '#f9a8d4',
    borderWidth: 1,
    padding: 10,
  },
  listContainer: {
    // dynamic height/width set at runtime
    alignItems: 'center',
  },
  containerInner: {
    width: 150,
    flexDirection: 'row',
  },
  list: {
    // dynamic height/width set at runtime
  },
  itemContainer: {
    width: ITEM_SIZE,
    height: ITEM_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 20,
    color: '#9ca3af',
  },
  itemTextSelected: {
    fontSize: 24,
    color: '#ec4899',
    fontWeight: '700',
  },
  separator: {
    fontSize: 24,
    fontWeight: '700',
    color: '#9d174d',
    paddingHorizontal: 4,
  },
});

export const constants = {
  ITEM_SIZE,
};

export default styles;


