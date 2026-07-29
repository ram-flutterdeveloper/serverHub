'use client';

import React, { useState, useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Rating,
  Chip,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Person,
  Business,
  Star,
  CalendarToday,
  RateReview,
  Reply,
} from '@mui/icons-material';
import { useRouter, useParams } from 'next/navigation';

import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import { dummyReviews } from '@/data/reviews';
import { Review } from '@/types';
import { formatDate, formatRelativeTime } from '@/utils';

export default function ReviewDetailPage() {
  const router = useRouter();
  const params = useParams();
  const reviewId = params.id as string;

  const [reviews, setReviews] = useState<Review[]>(dummyReviews);

  const review = useMemo(
    () => reviews.find((r) => r.id === reviewId),
    [reviews, reviewId]
  );

  if (!review) {
    return (
      <AdminLayout>
        <Typography variant="h6" color="text.secondary" sx={{ py: 8, textAlign: 'center' }}>
          Review not found
        </Typography>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        title="Review Details"
        subtitle={`Review by ${review.customerName}`}
        breadcrumbs={[
          { label: 'Home', path: '/dashboard' },
          { label: 'Reviews', path: '/reviews' },
          { label: review.customerName },
        ]}
        action={
          <Button variant="outlined" startIcon={<ArrowBack />} onClick={() => router.push('/reviews')}>
            Back to Reviews
          </Button>
        }
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Typography variant="h5" fontWeight={700}>
                    Review
                  </Typography>
                  <StatusChip status={review.isVisible ? 'active' : 'inactive'} size="medium" label={review.isVisible ? 'Visible' : 'Hidden'} />
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <Star color="warning" />
                  <Typography variant="h4" fontWeight={700}>
                    {review.rating}.0
                  </Typography>
                  <Typography variant="body2" color="text.secondary">/ 5.0</Typography>
                </Box>
                <Rating value={review.rating} precision={0.5} readOnly sx={{ mt: 1 }} />
              </Box>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Customer Review
              </Typography>
              <Typography variant="body1" sx={{ lineHeight: 1.8, color: 'text.secondary', mb: 3 }}>
                &quot;{review.comment}&quot;
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                Provider Reply
              </Typography>
              {review.reply ? (
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderRadius: 1, borderLeft: 3, borderColor: 'primary.main' }}>
                  <Typography variant="body1" sx={{ lineHeight: 1.8 }}>
                    {review.reply}
                  </Typography>
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                  No reply yet
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Review Info
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <CalendarToday color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Date"
                    secondary={formatDate(review.createdAt)}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <RateReview color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Service"
                    secondary={review.service}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Star color="warning" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Rating"
                    secondary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Rating value={review.rating} size="small" readOnly />
                        <Typography variant="body2" fontWeight={600}>{review.rating}/5</Typography>
                      </Box>
                    }
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ mb: 3 }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Customer Info
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Person color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={review.customerName}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Person color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Customer ID"
                    secondary={review.customerId}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Provider Info
              </Typography>
              <List disablePadding>
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Business color="primary" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Name"
                    secondary={review.providerName}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
                <Divider />
                <ListItem disablePadding sx={{ py: 1.5 }}>
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Business color="action" />
                  </ListItemIcon>
                  <ListItemText
                    primary="Provider ID"
                    secondary={review.providerId}
                    primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AdminLayout>
  );
}
