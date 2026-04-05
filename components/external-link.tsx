import React from 'react';
import { Text, Linking, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
  href: string;
  children: React.ReactNode;
}

export function ExternalLink({ href, children }: Props) {
  const handlePress = async () => {
    const supported = await Linking.canOpenURL(href);
    if (supported) {
      await Linking.openURL(href);
    }
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      {typeof children === 'string' ? (
        <Text style={styles.link}>{children}</Text>
      ) : (
        children
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  link: {
    color: '#007AFF',
    textDecorationLine: 'underline',
  },
});
