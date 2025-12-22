import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
} from './dialog';

describe('Dialog Component', () => {
  it('should not render dialog content initially', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <p>Dialog Content</p>
        </DialogContent>
      </Dialog>
    );

    expect(screen.queryByText('Dialog Content')).not.toBeInTheDocument();
  });

  it('should open dialog when trigger is clicked', () => {
    render(
      <Dialog>
        <DialogTrigger>Open Dialog</DialogTrigger>
        <DialogContent>
          <DialogTitle>Dialog Title</DialogTitle>
          <p>Dialog Content</p>
        </DialogContent>
      </Dialog>
    );

    fireEvent.click(screen.getByText('Open Dialog'));

    expect(screen.getByText('Dialog Content')).toBeInTheDocument();
    expect(screen.getByText('Dialog Title')).toBeInTheDocument();
  });
});
