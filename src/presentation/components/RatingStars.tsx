import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme';

type RatingStarsProps = {
  rating: number;
};

export function RatingStars({ rating }: RatingStarsProps) {
  const rounded = Math.round(rating);

  return (
    <View style={styles.row} accessibilityLabel={`Rating ${rating.toFixed(2)} out of 5`}>
      {Array.from({ length: 5 }, (_, index) => {
        const filled = index < rounded;
        return (
          <Text key={index} style={[styles.star, filled && styles.filled]}>
            {filled ? '★' : '☆'}
          </Text>
        );
      })}
      <Text style={styles.value}>{rating.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  star: {
    fontSize: 18,
    color: colors.muted,
  },
  filled: {
    color: colors.star,
  },
  value: {
    marginLeft: 6,
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
  },
});
