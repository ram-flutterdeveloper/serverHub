'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Button,
} from '@mui/material';
import { DataGrid, type GridColDef } from '@mui/x-data-grid';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '@/components/layout/AdminLayout';
import PageHeader from '@/components/common/PageHeader';
import StatusChip from '@/components/common/StatusChip';
import SearchField from '@/components/common/SearchField';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import FormDialog from '@/components/common/FormDialog';
import FormTextField from '@/components/common/FormTextField';
import FormSelect from '@/components/common/FormSelect';
import { dummySubServices } from '@/data/subServices';
import { dummyCategories } from '@/data/categories';
import type { SubService } from '@/types';

const subServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  categoryId: z.string().min(1, 'Category is required'),
  description: z.string().optional(),
});

type SubServiceFormData = z.infer<typeof subServiceSchema>;

export default function SubServicesPage() {
  const [subServices, setSubServices] = useState<SubService[]>(dummySubServices);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selected, setSelected] = useState<SubService | null>(null);

  const addForm = useForm<SubServiceFormData>({
    resolver: zodResolver(subServiceSchema),
    defaultValues: { name: '', categoryId: '', description: '' },
  });

  const editForm = useForm<SubServiceFormData>({
    resolver: zodResolver(subServiceSchema),
    defaultValues: { name: '', categoryId: '', description: '' },
  });

  const categoryOptions = dummyCategories.map((c) => ({ value: c.id, label: c.name }));

  const filtered = useMemo(() => {
    return subServices.filter((s) => {
      const matchesSearch =
        !search ||
        s.name.toLowerCase().includes(search.toLowerCase()) ||
        s.categoryName.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !categoryFilter || s.categoryId === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [subServices, search, categoryFilter]);

  const handleAdd = (data: SubServiceFormData) => {
    const cat = dummyCategories.find((c) => c.id === data.categoryId);
    const newSub: SubService = {
      id: String(subServices.length + 1),
      name: data.name,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
      categoryId: data.categoryId,
      categoryName: cat?.name || '',
      description: data.description || '',
      isActive: true,
      serviceCount: 0,
      createdAt: new Date().toISOString(),
    };
    setSubServices((prev) => [...prev, newSub]);
    setAddOpen(false);
    addForm.reset();
  };

  const handleEdit = (data: SubServiceFormData) => {
    if (!selected) return;
    const cat = dummyCategories.find((c) => c.id === data.categoryId);
    setSubServices((prev) =>
      prev.map((s) =>
        s.id === selected.id
          ? { ...s, name: data.name, categoryId: data.categoryId, categoryName: cat?.name || '', description: data.description || '' }
          : s
      )
    );
    setEditOpen(false);
    editForm.reset();
    setSelected(null);
  };

  const handleDelete = () => {
    if (!selected) return;
    setSubServices((prev) => prev.filter((s) => s.id !== selected.id));
    setDeleteOpen(false);
    setSelected(null);
  };

  const openEdit = (row: SubService) => {
    setSelected(row);
    editForm.reset({ name: row.name, categoryId: row.categoryId, description: row.description });
    setEditOpen(true);
  };

  const openDelete = (row: SubService) => {
    setSelected(row);
    setDeleteOpen(true);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      flex: 1,
      minWidth: 180,
      renderCell: (params) => (
        <Typography variant="body2" fontWeight={500}>
          {params.row.name}
        </Typography>
      ),
    },
    { field: 'categoryName', headerName: 'Category', flex: 1, minWidth: 150 },
    {
      field: 'serviceCount',
      headerName: 'Services',
      width: 100,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'isActive',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <StatusChip status={params.value ? 'active' : 'inactive'} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => openEdit(params.row)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" color="error" onClick={() => openDelete(params.row)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        title="Sub Services"
        description="Manage sub-services"
        action={
          <Button variant="contained" startIcon={<AddIcon />} onClick={() => setAddOpen(true)}>
            Add Sub Service
          </Button>
        }
      />

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <SearchField value={search} onChange={setSearch} placeholder="Search sub-services..." />
        <FormSelect
          value={categoryFilter}
          onChange={(val) => setCategoryFilter(val as string)}
          options={[{ value: '', label: 'All Categories' }, ...categoryOptions]}
          size="small"
          sx={{ minWidth: 200 }}
        />
      </Box>

      <Box sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={filtered}
          columns={columns}
          pageSizeOptions={[10, 25, 50]}
          initialState={{ pagination: { paginationModel: { pageSize: 10 } } }}
          disableRowSelectionOnClick
          autoHeight
          sx={{
            '& .MuiDataGrid-cell': { py: 1.5 },
          }}
        />
      </Box>

      <FormDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add Sub Service"
        onSubmit={addForm.handleSubmit(handleAdd)}
      >
        <FormTextField control={addForm.control} name="name" label="Name" required />
        <FormSelect
          control={addForm.control}
          name="categoryId"
          options={categoryOptions}
          label="Category"
          required
        />
        <FormTextField control={addForm.control} name="description" label="Description" multiline rows={3} />
      </FormDialog>

      <FormDialog
        open={editOpen}
        onClose={() => {
          setEditOpen(false);
          setSelected(null);
          editForm.reset();
        }}
        title="Edit Sub Service"
        onSubmit={editForm.handleSubmit(handleEdit)}
      >
        <FormTextField control={editForm.control} name="name" label="Name" required />
        <FormSelect
          control={editForm.control}
          name="categoryId"
          options={categoryOptions}
          label="Category"
          required
        />
        <FormTextField control={editForm.control} name="description" label="Description" multiline rows={3} />
      </FormDialog>

      <ConfirmDialog
        open={deleteOpen}
        onClose={() => {
          setDeleteOpen(false);
          setSelected(null);
        }}
        onConfirm={handleDelete}
        title="Delete Sub Service"
        message={`Are you sure you want to delete "${selected?.name}"?`}
        confirmText="Delete"
        severity="error"
      />
    </AdminLayout>
  );
}
