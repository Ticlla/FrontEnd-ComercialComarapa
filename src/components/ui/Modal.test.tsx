import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing when isOpen is false', () => {
    const { container } = render(
      <Modal isOpen={false} onClose={() => {}}>
        Content
      </Modal>
    );
    
    expect(container.firstChild).toBeNull();
  });

  it('renders content when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div data-testid="modal-content">Hello World</div>
      </Modal>
    );
    
    expect(screen.getByTestId('modal-content')).toBeInTheDocument();
    expect(screen.getByText('Hello World')).toBeInTheDocument();
  });

  it('renders title when provided', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Title">
        Content
      </Modal>
    );
    
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders close button', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test">
        Content
      </Modal>
    );
    
    expect(screen.getByLabelText('Close modal')).toBeInTheDocument();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={onClose} title="Test">
        Content
      </Modal>
    );
    
    fireEvent.click(screen.getByLabelText('Close modal'));
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>
    );
    
    // Click on backdrop (the element with aria-hidden="true")
    const backdrop = document.querySelector('[aria-hidden="true"]');
    if (backdrop) {
      fireEvent.click(backdrop);
    }
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when ESC key is pressed', () => {
    const onClose = vi.fn();
    
    render(
      <Modal isOpen={true} onClose={onClose}>
        Content
      </Modal>
    );
    
    fireEvent.keyDown(document, { key: 'Escape' });
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('has proper accessibility attributes', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Accessible Modal">
        Content
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveAttribute('aria-labelledby');
  });

  it('applies correct size class for sm', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} size="sm">
        Content
      </Modal>
    );
    
    const modalContent = document.querySelector('.max-w-sm');
    expect(modalContent).toBeInTheDocument();
  });

  it('applies correct size class for lg', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} size="lg">
        Content
      </Modal>
    );
    
    const modalContent = document.querySelector('.max-w-lg');
    expect(modalContent).toBeInTheDocument();
  });

  it('uses md size by default', () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        Content
      </Modal>
    );
    
    const modalContent = document.querySelector('.max-w-md');
    expect(modalContent).toBeInTheDocument();
  });
});




