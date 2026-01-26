import { Box, Typography } from '@mui/material';

export function Testi() {
  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        padding: 4,
        boxSizing: 'border-box',
      }}
    >
      <Typography variant="h4" gutterBottom>
        TESTI
      </Typography>

      <Box
        sx={{
          height: '100%',
          marginTop: 2,
          backgroundColor: 'grey.100',
          borderRadius: 2,
          padding: 2,
          overflow: 'auto',
        }}
      >
        {[...Array(20)].map((_, i) => (
          <Typography key={i} paragraph>
            Liirum laarum #{i + 1} — Lorem ipsum dolor sit amet,
            consectetur adipiscing elit. Integer nec odio. Praesent
            libero. Sed cursus ante dapibus diam.
          </Typography>
        ))}
      </Box>
    </Box>
  );
}