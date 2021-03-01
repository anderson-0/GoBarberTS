import { container } from 'tsyringe';
import FakeMailProvider from './MailProvider/fakes/FakeMailProvider';
import DiskStorageProvider from './StorageProvider/implementations/DiskStorageProvider';

container.registerSingleton('StorageProvider', DiskStorageProvider);
container.registerSingleton('MailProvider', FakeMailProvider);
