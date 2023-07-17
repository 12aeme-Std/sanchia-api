import { AccessControl } from 'accesscontrol';
import { UserRole, ClientRole } from '@prisma/client';

class SystemRoles {
    public ac: AccessControl = new AccessControl();
    constructor() {
        this.ac = new AccessControl();
        this.asignRoles();
    }

    asignRoles = () => {
        this.ac
            .grant(UserRole.ADMIN)
            .create('product')
            .update('product')
            .delete('product')
            .create('category')
            .update('category')
            .delete('category')
            .create('promo')
            .update('promo')
            .delete('promo')
            .read('promo');

        this.ac
            .grant(UserRole.SELLER)
            .create('predorder')
            .update('predorder')
            .delete('predorder')
            .read('predorder');

        this.ac
            .grant(ClientRole.BUYER)
            .create('order')
            .read('cart')
            .create('cart')
            .delete('cart');
    };
}

const systemRoles = new SystemRoles();
export default systemRoles.ac;
