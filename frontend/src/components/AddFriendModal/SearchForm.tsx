import React from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form';
import type { IFormValues } from '../chat/AddFriendModal';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { DialogClose, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Search } from 'lucide-react';

interface SearchFormProps {
  register: UseFormRegister<IFormValues>;
  errors: FieldErrors<IFormValues>;
  loading: boolean;
  userNameValue: string;
  isFound: boolean | null;
  searchedUserName: string;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

const SearchForm = ({
  register,
  errors,
  userNameValue,
  loading,
  isFound,
  searchedUserName,
  onSubmit,
  onCancel,
}: SearchFormProps) => {
  return (
    <form onSubmit={onSubmit} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='userName' className='text-sm font-semibold'>Tìm bằng userName</Label>
        <Input id='userName'
         placeholder='Tà Cưa'
         className='glass border-border/50 focus:border-primary/50 transition-smooth'
         {...register("userName",{ required :"userName không được bỏ trống"
        })}></Input>
        {errors.userName && (
          <p className='text-sm text-destructive'>{errors.userName.message}</p>
        )}

        {isFound === false && (
          <span className='error-message'>
            Không tìm thấy 
            <span className='font-semibold'>@{searchedUserName}</span>
          </span>
        )}
      </div>

      <DialogFooter>
        <DialogClose asChild>
          <Button 
          type='button'
          variant='outline'
          className='flex-1 glass hover:text-destructive'
          onClick={onCancel}
          >
            Cancel
          </Button>
        </DialogClose>
        <Button 
          type='submit'
          disabled={loading || !userNameValue?.trim()}
          className='flex-1 bg-gradient-chat text-white hover:opacity-90 transition-smooth'
        >
          {
            loading ? (
              <span>Đang tìm</span>
            ) : (
              <>
                <Search className='size-4 mr-2'/>
              </>
            )
          }
        </Button>
      </DialogFooter>
    </form>
  )
}

export default SearchForm