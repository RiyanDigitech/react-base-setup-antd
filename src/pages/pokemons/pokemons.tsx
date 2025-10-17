import React, { useState, useMemo } from 'react';
import { useFetchAllPokemons } from '@/services/pokemons/pokemons';
import { Table, Input, Spin, Alert, Tag, Image as AntImage, Button, Flex, Space } from 'antd';
import { SearchOutlined, ClearOutlined } from '@ant-design/icons';
import type { TableProps, TablePaginationConfig } from 'antd';

// Interface/Types (No changes here)
interface DataType {
  key: string;
  name: string;
  image?: string;
  types?: string[];
}

function Pokemons() {
  // 1. Input ki value ke liye alag state banayein
  const [inputValue, setInputValue] = useState<string>('');
  // 2. Jo value search ki gayi hai, uske liye alag state
  const [searchedTerm, setSearchedTerm] = useState<string>('');
  
  const [pagination, setPagination] = useState<TablePaginationConfig>({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // API call ke liye parameters ab 'searchedTerm' par depend karenge
  const queryParams = {
    limit: pagination.pageSize,
    offset: pagination.current ? (pagination.current - 1) * (pagination.pageSize || 10) : 0,
    name: searchedTerm || undefined,
  };

  const { data, isLoading, isError, error } = useFetchAllPokemons(queryParams);

  // 3. Search button ke click par yeh function chalega
  const handleSearchClick = () => {
    const term = inputValue.trim().toLowerCase();
    setPagination(prev => ({ ...prev, current: 1 })); // Har nayi search par page 1 par jayein
    setSearchedTerm(term);
  };

  // 4. Search ko clear karne ke liye function
  const handleClearSearch = () => {
    setInputValue('');
    setSearchedTerm('');
    setPagination(prev => ({ ...prev, current: 1 })); // Page 1 par wapas jayein
  };

  // useMemo for data (No changes here)
  const tableData = useMemo(() => {
    if (!data) return { dataSource: [], total: 0 };
    if ('id' in data) { // Single search result
      return {
        dataSource: [{ key: data.id, name: data.name, image: data.image, types: data.types }],
        total: 1,
      };
    }
    if ('results' in data) { // Paginated list
      return {
        dataSource: data.results.map((p, index) => ({ key: `${p.name}-${index}`, name: p.name })),
        total: data.count,
      };
    }
    return { dataSource: [], total: 0 };
  }, [data]);
  
  // Table columns (No changes here)
  const columns: TableProps<DataType>['columns'] = [
    { title: 'Image', dataIndex: 'image', key: 'image', render: (image) => image ? <AntImage width={60} src={image} preview={false} /> : <div className=' flex justify-center items-center'><img src="/pokemon.jpg" className=' h-15 w-15' alt="" /></div> },
    { title: 'Name', dataIndex: 'name', key: 'name', render: (text) => <span style={{ textTransform: 'capitalize' }}>{text}</span> },
    { title: 'Types', dataIndex: 'types', key: 'types', render: (types: string[] = []) => (<>{types.length > 0 ? types.map(type => <Tag key={type}>{type.toUpperCase()}</Tag>) : '-'}</>) },
  ];
  
  // Table pagination change handler
  const handleTableChange: TableProps<DataType>['onChange'] = (newPagination) => {
    if (searchedTerm) {
      // Agar user ne kuch search kiya hua hai, to pagination use karne par search clear kar dein
      handleClearSearch();
    }
    setPagination(newPagination);
  };

  if (isError) {
    return <Alert message="Error" description={error.message} type="error" showIcon />;
  }
  
  return (
    <div className='p-5'>
      <h1 className='text-2xl mb-4 font-bold'>Pokémon Directory</h1>
      
      {/* 5. Naya Search Bar aur Buttons UI */}
      <Flex gap="small" align="center" style={{ maxWidth: 500, marginBottom: 20 }}>
        <Input
          placeholder="Search Pokémon by name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onPressEnter={handleSearchClick} // User Enter bhi daba sakta hai
        />
        <Button icon={<SearchOutlined />} onClick={handleSearchClick}>
          Search
        </Button>
        <Button icon={<ClearOutlined />} onClick={handleClearSearch}>
          Clear
        </Button>
      </Flex>

      <Spin spinning={isLoading}>
        <Table
          columns={columns}
          dataSource={tableData.dataSource}
          pagination={{ ...pagination, total: tableData.total }}
          onChange={handleTableChange}
          bordered
          rowKey="key"
        />
      </Spin>
    </div>
  );
}

export default Pokemons;